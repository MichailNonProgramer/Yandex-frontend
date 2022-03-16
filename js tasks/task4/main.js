/**
 * Возвращает новый emitter
 * @returns {Object}
 */
isStar = true
class EventInfo {
    constructor(context, handler, call, times, frequency) {
        this.context = context
        this.handler = handler
        this.call = call
        this.times = times
        this.frequency = frequency
    }
    addCall() {
        this.call += 1
    }

    getCountCall() {
        return this.call
    }

}
function getEmitter() {
    let events = new Map();

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param times
         * @param frequency
         */
        on: function (event, context, handler, times=Infinity, frequency = 1) {
            if (!events.has(event)) {
                events.set(event, []);
            }
            events.get(event).push( new EventInfo(context, handler, 0, times, frequency ));
            return this
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */
        off: function (event, context) {
            for (let i of events.keys()) {
                if (i.indexOf(event) !== -1 && (i.startsWith(event + '.') || i === event)) {
                        let arr = events.get(i)
                        events.set(i, arr.filter(function (i) {
                            return i.context !== context
                        }))
                }
            }
            return this
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            let eventsEmit = []
            if (event.indexOf('.') !== -1){
                let e = event.split('.')
                let str = '';
                for (let i of e){
                    str += i
                    eventsEmit.push(str)
                    str = str + '.'
                }
                eventsEmit.reverse()
            } else eventsEmit.push(event)
            for (let e of eventsEmit) {
                if (events.has(e)) {
                    for (let i of events.get(e)) {
                        if (i.times > i.getCountCall() && i.getCountCall() % i.frequency === 0) {
                            i.handler.call(i.context)
                            i.addCall()
                        } else i.addCall()
                    }
                }
            }
            return this
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            if (times <= 0)
                this.on(event,context,handler)
            else this.on(event,context,handler,times)
            return this
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                this.on(event, context, handler)
            } else this.on(event, context, handler, Infinity, frequency)
            return this
        }
    };
}

module.exports = {
    getEmitter,
    isStar
};
