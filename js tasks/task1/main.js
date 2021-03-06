'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
    if (!Number.isInteger(a) || !Number.isInteger(b))
        throw new TypeError("Error")
    return +a + b
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
    if (!Number.isInteger(year))
        throw TypeError("Error")
    if (year < 0)
        throw new RangeError("Error")
    return Math.ceil(year / 100)
}
/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
    if (typeof(hexColor) != 'string')
        throw new TypeError("Error")
    let reg = new RegExp('#[0-9a-fA-F]{6}')
    if (!reg.test(hexColor))
        throw new RangeError("Error")
    var bigint = parseInt(hexColor.split('#')[1], 16)
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return "(" + r + ", " + g + ", " + b + ")"
}
    /**
     * Находит n-ое число Фибоначчи
     * @param {Number} n Положение числа в ряде Фибоначчи
     * @throws {TypeError} Когда в качестве положения в ряде передано не число
     * @throws {RangeError} Когда положение в ряде не является целым положительным числом
     * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
     */
function fibonacciProblem(n) {
    if (typeof(n) !== 'number')
        throw new TypeError("Error")
    if (n <= 0)
        throw new RangeError("Error")
    let a = 1
    let b = 1
    for (let i = 3; i <= n; i++) {
        let c = a + b
        a = b
        b = c
    }
    return b;
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
    let result = []
    for (let i = 0; i < matrix.length; i++)
        if (!Array.isArray(matrix[0]) || matrix[0].length !== matrix[i].length)
            throw new TypeError("Error")
    try {
        for (let i = 0; i < matrix[0].length; i++) {
            result.push([])
            for (let j = 0; j < matrix.length; j++) {
                result[i].push([])
                result[i][j] = matrix[j][i]
            }
        }
        return result
    } catch {
        throw new TypeError("Error")
    }
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
    if (typeof(n) !== 'number' || !Number.isInteger(targetNs))
        throw new TypeError("Error")
    if (targetNs < 2 || targetNs > 36)
        throw new RangeError("Error")
    return n.toString(targetNs)
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
    if (typeof(phoneNumber) !== 'string')
        throw new TypeError("Error")
    let reg = new RegExp('^8\-800\-[0-9]{3}\-[0-9]{2}\-[0-9]{2}$')
    return reg.test(phoneNumber)
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */

function smilesProblem(text) {
    if (typeof(text) !== 'string')
        throw new TypeError("Error")
    let reg = new RegExp(':\-\\)|\\(\-:')
    return text.split(reg).length - 1
}
/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
    let res = []
    let check1 = ''
    let check2 = ''
    for (let i = 0; i < field.length; i++) {
        check1 += field[i][i]
        check2 += field[field.length - i - 1][i]
    }
    res.push(check1, check2)
    for (let i = 0; i < field.length; i++)
        res.push(field[i].reduce((previousValue, currentValue) =>
                (previousValue + currentValue)),
            field[0][i] + field[1][i] + field[2][i])
    return res.includes('xxx') ? 'x' : res.includes('ooo') ? 'o' : 'draw'
}

module.exports = {
    abProblem,
    centuryByYearProblem,
    colorsProblem,
    fibonacciProblem,
    matrixProblem,
    numberSystemProblem,
    phoneProblem,
    smilesProblem,
    ticTacToeProblem
};