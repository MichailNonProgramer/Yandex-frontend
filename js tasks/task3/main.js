'use strict';
const isStar = true;
const isPeriodsNestedOrIntersect = (thief1, thief2) => thief1.from < thief2.from && thief1.to > thief2.to
    || thief1.from > thief2.from && thief1.to < thief2.to || thief1.to >= thief2.from && thief2.to >= thief1.from
let timezone;
let StartWindow;
let EndWindow;

function getIntervalThiefs(gangBusyTimes) {
    let thief1 = gangBusyTimes.Danny
    let thief2 = gangBusyTimes.Rusty
    let thief3 = gangBusyTimes.Linus
    let possibleTimesTwoThiefs = []
    let possibleTimesThreeThiefs = []
    for (let i of thief1) {
        for (let j of thief2)
            if (isPeriodsNestedOrIntersect(i, j))
                possibleTimesTwoThiefs.push({
                    from: Math.max(i.from, j.from),
                    to: Math.min(i.to, j.to)
                })
    }
    for (let i of thief3) {
        for (let j of possibleTimesTwoThiefs)
            if (isPeriodsNestedOrIntersect(i, j))
                possibleTimesThreeThiefs.push({
                    from: Math.max(i.from, j.from),
                    to: Math.min(i.to, j.to)
                })
    }
    return possibleTimesThreeThiefs;
}

function getBankWorkingTimes(bankWorkingHours) {
    let bankTimes = []
    for(let day of Days[0].keys())
    {
        bankTimes.push({
            from: getMinutes(`${day} ${bankWorkingHours.from}`, timezone),
            to: getMinutes(`${day} ${bankWorkingHours.to}`, timezone)
        })
    }
    return bankTimes;
}

function getPeriodOnMinutes(period) {
    return {
        from: getMinutes(period.from, timezone),
        to: getMinutes(period.to, timezone)
    };
}

const Days = [new Map(
    [
        ['ПН', 0],
        ['ВТ', 24],
        ['СР', 24 * 2]
    ]
), ['ПН', 'ВТ', 'СР'] ];


const getMinutes = (dateString) =>
    (Days[0].get(dateString.slice(0, 2)) + parseInt(dateString.slice(3, 5)) - parseInt(dateString.slice(9)) + timezone) * 60 + parseInt(dateString.slice(6, 8));

/**
 *
 * @param {Object[]}possibleTimesThiefs Пересечение времен ограбления воров
 * @param {Object[]}timeBank Время работы банка
 * @param {number}duration Время на ограбление
 * @returns {Object} Возможные времена начала ограбления
 */
function getPossibleTimesRobberies (possibleTimesThiefs, timeBank, duration){
    let possibleTimes = []
    for (let i of possibleTimesThiefs) {
        for (let j of timeBank) {
            if (isPeriodsNestedOrIntersect(i, j)) {
                if (Math.min(i.to, j.to) - Math.max(i.from, j.from) >= duration)
                    possibleTimes.push({
                        from: Math.max(i.from, j.from),
                        to: Math.min(i.to, j.to)
                    })
            }
        }
    }
    return possibleTimes
}

function getFreePeriods(periods) {
    let resultPeriods = {Danny:[],Rusty:[],Linus:[]}
    resultPeriods.Rusty = (getFreePeriodsOneThief(periods.Rusty))
    resultPeriods.Danny = (getFreePeriodsOneThief(periods.Danny))
    resultPeriods.Linus = (getFreePeriodsOneThief(periods.Linus))
    return resultPeriods
}

/**
 * @param {Object[]} period  Периоды ограбления одного вора
 * @returns {Object[]}
 */
function getFreePeriodsOneThief(period){
    period.sort((a, b) => a.from - b.to);
    let leftBorder = StartWindow;
    let newPeriods = [];
    period.forEach(period => {
        newPeriods.push({from: leftBorder, to: period.from});
        leftBorder = period.to;
    });
    newPeriods.push({from: leftBorder, to: EndWindow});
    return newPeriods
}

/**
 * @param {string} template  формат вывода
 * @param {number} resultMinutes  время начала ограбления в минутах
 * @returns {string}
 */

function createOutFormat(template, resultMinutes){
    let h = Math.floor(resultMinutes / 60) % 24;
    if (h < 10)
        h = `0${h}`
    let m = resultMinutes % 60;
    if (m < 10)
        m = `0${m}`
    let d = Days[1][Math.floor(resultMinutes / (60 * 24))];
    return template
        .replace('%DD', d)
        .replace('%HH', h)
        .replace('%MM', m)
}
/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */

function getAppropriateMoment(schedule, duration, workingHours) {
    timezone = parseInt(workingHours.from.slice(6));
    EndWindow  = getMinutes(`СР 23:59+${timezone}`)
    StartWindow= getMinutes(`ПН 00:00+${timezone}`)
    const workingTimesMinutes = getBankWorkingTimes(workingHours);
    const scheduleMinutes = {
        Linus: schedule.Linus.map(x => getPeriodOnMinutes(x)),
        Danny: schedule.Danny.map(x => getPeriodOnMinutes(x)),
        Rusty: schedule.Rusty.map(x => getPeriodOnMinutes(x))
    };
    let freeTimes = getFreePeriods(scheduleMinutes)
    let robberyTimes = getIntervalThiefs(freeTimes);
    let resultTimes = getPossibleTimesRobberies(robberyTimes, workingTimesMinutes, duration)
    return {
        /**
         * Найдено ли время
         * @returns {boolean}
         */
        exists() {
            return resultTimes.length > 0;
        },

        /**
         * Возвращает отформатированную строку с часами
         * для ограбления во временной зоне банка
         *
         * @param {string} template
         * @returns {string}
         *
         * @example
         * ```js
         * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
         * ```
         */
        format(template) {
            if (!this.exists())
                return ''
            return createOutFormat(template, resultTimes[0].from);
        },

        /**
         * Попробовать найти часы для ограбления позже [*]
         * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
         * @returns {boolean}
         */
        tryLater() {
            if (!this.exists())
                return false
            if (resultTimes[0].to - resultTimes[0].from - 30 >= duration) {
                resultTimes[0].from = resultTimes[0].from + 30
                return true
            }
            if (resultTimes.length > 1){
                resultTimes.shift()
                return true
            }
            return false;
        }
    };
}

module.exports = {
    getAppropriateMoment, isStar
};