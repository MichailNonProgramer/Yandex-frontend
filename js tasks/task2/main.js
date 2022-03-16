'use strict';

/**
 * Телефонная книга
 */
const phoneBook = new Map();
const phoneRegExp = /^\d{10}$/;
let lineNumber = 0;
let charNumber = 0;

const Commands = {
    Create: 'Создай',
    Delete: 'Удали',
    Add: 'Добавь',
    Show: 'Покажи'
}

const ObjectCommandsCreate = {
    Contact: 'контакт',
}

const ObjectCommandsAdd = {
    Phone: 'телефон',
    Email: 'почту',
    Contact: 'контакта',

}

const ObjectCommandsDelete = {
    Phone: 'телефон',
    Contact: 'контакт',
    Email: 'почту',
    Contacts: 'контакты,'
}

const ObjectCommandsShow = {
    Contacts: 'контактов,',
    Name: 'имя',
    Phones: 'телефоны',
    Emails: 'почты',
}




/**
 * Вызывайте эту функцию, если есть синтаксическая ошибка в запросе
 * @param {number} lineNumber – номер строки с ошибкой
 * @param {number} charNumber – номер символа, с которого запрос стал ошибочным
 */
function syntaxError(lineNumber, charNumber) {
    throw new Error(`SyntaxError: Unexpected token at ${lineNumber}:${charNumber}`);
}

function createContact(name) {
    if (!phoneBook.has(name))
        phoneBook.set(name, {'mails': [], 'phones': []})
}

function deleteContact(name){
    if (phoneBook.has(name))
        phoneBook.delete(name)
}
/**
 * Добавление длинны слова к индексу
 * @param {string} word
 */
function addLengthCorrectWord(word) {
    charNumber += word.length + 1
}

/**
 * Выполнение запроса на языке pbQL
 * @param {string} query
 * @returns {string[]} - строки с результатами запроса
 */
function run(query) {
    let queries = query.split(';')
    let checklast = false
    if (queries[queries.length - 1] !== '')
        checklast = true
    else
        queries = queries.slice(0, queries.length - 1)
    let res = []
    lineNumber = 0;
    for(let command of queries){
        const currentWorlds = command.split(' ')
        charNumber = 0;
        lineNumber += 1
        switch (currentWorlds[0]) {
            case Commands.Create:
                addLengthCorrectWord(Commands.Create)
                switch (currentWorlds[1]){
                    case ObjectCommandsCreate.Contact:
                        if(currentWorlds.length >= 3) {
                            addLengthCorrectWord(ObjectCommandsCreate.Contact)
                            let name = currentWorlds.slice(2).join(' ')
                            createContact(name)
                            addLengthCorrectWord(name)
                            charNumber -= 1
                        } else
                            syntaxError(lineNumber, charNumber + 1)
                        break
                    default:
                        syntaxError(lineNumber, charNumber + 1)
                }
                break
            case Commands.Add:
                addLengthCorrectWord(Commands.Add)
                parseAddDeleteCommand(currentWorlds)
                break
            case Commands.Show:
                addLengthCorrectWord(Commands.Show)
                let resultShowCommand = parseShowDeleteCommand(currentWorlds)
                if (resultShowCommand.length !== 0)
                    res = res.concat(resultShowCommand)
                break
            case Commands.Delete:
                // let a = 'a'
                // for (let i = 0; i < 100000000; i++){
                //     a += 'a'
                //}
                addLengthCorrectWord(Commands.Delete)
                if (currentWorlds[1] === ObjectCommandsDelete.Contact) {
                    addLengthCorrectWord(ObjectCommandsDelete.Contact)
                    deleteContact(currentWorlds.slice(2).join(' '))
                } else
                if (currentWorlds.includes('где') && currentWorlds.includes('есть')) {
                    parseShowDeleteCommand(currentWorlds)
                }
                else
                    parseAddDeleteCommand(currentWorlds)
                break
            default:
                syntaxError(lineNumber, charNumber + 1)
        }

    }
    if (checklast)
        syntaxError(lineNumber, charNumber + 1)
    return res;
}
/**
 * Выполнение команды добавления
 * @param {string[]} commands
 * @param {string} contact
 */
function execAddCommand(commands, contact) {
    for(let words of commands){
        const name = phoneBook.get(contact)
        switch (words[0]) {
            case ObjectCommandsAdd.Phone:
                if (!name['phones'].includes(words[1]))
                    name['phones'].push(words[1])
                break
            case ObjectCommandsAdd.Email:
                if (!name['mails'].includes(words[1]))
                    name['mails'].push(words[1])
                break
        }
    }
}

/**
 * Выполнение команды удаления
 * @param {string[]} commands
 * @param {string} contact
 */

function execDeleteCommand(commands, contact) {
    for (let words of commands) {
        const name = phoneBook.get(contact)
        let index = 0;
        switch (words[0]) {
            case ObjectCommandsDelete.Phone:
                if (name['phones'].includes(words[1])) {
                    index = name['phones'].indexOf(words[1])
                    name['phones'].splice(index, 1)
                }
                break
            case ObjectCommandsDelete.Email:
                if (name['mails'].includes(words[1])) {
                    index = name['mails'].indexOf(words[1])
                    name['mails'].splice(index, 1)
                }
                break
            case ObjectCommandsDelete.Contact:
                phoneBook.delete(name)
                break
        }
    }
}
/**
 * Выполнение команды удаления для группы
 * @param{string} expr
 */
function execDeleteCommands( expr){
    for (let phoneBookRecording of phoneBook.keys()) {
        let detetedChek = false;
        if (phoneBookRecording.includes(expr) && !detetedChek) {
            phoneBook.delete(phoneBookRecording)
            detetedChek = true
            continue
        }
        if (!detetedChek)
            for(let mail of phoneBook.get(phoneBookRecording)['mails']){
                if (mail.includes(expr) && !detetedChek) {
                    phoneBook.delete(phoneBookRecording)
                    detetedChek = true
                    break
                }
            }
        if (!detetedChek)
            for(let phone of phoneBook.get(phoneBookRecording)['phones']){
                if (phone.includes(expr) && !detetedChek) {
                    phoneBook.delete(phoneBookRecording)
                    detetedChek = true
                    break
                }
        }
    }
}

function checkContainsExp(arr, expr){
    for (let el of arr){
        if (el.includes(expr))
            return true
    }
    return false
}

function execShowCommands(commands, expr){
    let res = []
    for (let phoneBookRecording of phoneBook.keys()){
        let resOneContact = []
        let chekContainsExp = phoneBookRecording.includes(expr)
            || checkContainsExp(phoneBook.get(phoneBookRecording)['mails'], expr)
            || checkContainsExp(phoneBook.get(phoneBookRecording)['phones'], expr)
        for (const command of commands){
            switch (command) {
                case ObjectCommandsShow.Name:
                    if (chekContainsExp)
                        resOneContact.push(phoneBookRecording)
                    break
                case ObjectCommandsShow.Emails:
                    const mails = phoneBook.get(phoneBookRecording)['mails']
                    if (chekContainsExp)
                        resOneContact.push(mails.join(','))
                    break
                case ObjectCommandsShow.Phones:
                    let phones = phoneBook.get(phoneBookRecording)['phones']
                    if (chekContainsExp) {
                        phones = convertCorrectPhones(phones)
                        resOneContact.push(phones)
                    }
                    break
            }
        }
        if (resOneContact.length !== 0)
            res.push(resOneContact.join(';'))
    }
    return res
}
/**
 * Парсинг данных для показа
 * @param {string[]} command
 * @return{string[]}
 */
function parseShowDeleteCommand(command){
    const mainCommand = command[0]
    command = command.slice(1)
    let correctCommand = []
    let expr = ''
    let result = []
    let checkCom = true
    let i = 0
    while (checkCom){
        switch (command[i]){
            case ObjectCommandsShow.Name:
                addLengthCorrectWord(ObjectCommandsShow.Name)
                correctCommand.push(ObjectCommandsShow.Name)
                if (command[i + 1] !== 'и' && command[i + 1] !== 'для')
                    syntaxError(lineNumber, charNumber + 1)
                i += 1
                break
            case ObjectCommandsShow.Emails:
                addLengthCorrectWord(ObjectCommandsShow.Emails)
                correctCommand.push(ObjectCommandsShow.Emails)
                if (command[i + 1] !== 'и' && command[i + 1] !== 'для')
                    syntaxError(lineNumber, charNumber + 1)
                i += 1
                break
            case ObjectCommandsShow.Phones:
                addLengthCorrectWord(ObjectCommandsShow.Phones)
                correctCommand.push(ObjectCommandsShow.Phones)
                if (command[i + 1] !== 'и' && command[i + 1] !== 'для')
                    syntaxError(lineNumber, charNumber + 1)
                i += 1
                break
            case 'и':
                addLengthCorrectWord('и')
                if (command[i + 1] === 'и' || command[i + 1] === 'для')
                    syntaxError(lineNumber, charNumber + 1)
                i += 1
                break
            case 'для':
                addLengthCorrectWord('для')
                if (command[i + 1] === ObjectCommandsShow.Contacts){
                    addLengthCorrectWord(ObjectCommandsShow.Contacts)
                    if (command[i + 2] === 'где') {
                        addLengthCorrectWord('где')
                        if (command[i + 3] === 'есть') {
                            addLengthCorrectWord('есть')
                            {
                                expr = command.slice(i + 4).join(' ')
                                checkCom = false
                                addLengthCorrectWord(expr)
                                charNumber -= 1
                            }
                        } else syntaxError(lineNumber, charNumber + 1)
                    } else syntaxError(lineNumber, charNumber + 1)
                } else syntaxError(lineNumber, charNumber + 1)
                break
            case ObjectCommandsDelete.Contacts:
                addLengthCorrectWord(ObjectCommandsDelete.Contacts)
                if (command[i + 1] === 'где') {
                    addLengthCorrectWord('где')
                    if (command[i + 2] === 'есть') {
                        addLengthCorrectWord('есть')
                        {
                            checkCom = false
                            expr = command.slice(i + 3).join(' ')
                        }
                    } else syntaxError(lineNumber, charNumber + 1)
                } else syntaxError(lineNumber, charNumber + 1)
                break
            default:
                syntaxError(lineNumber, charNumber + 1)

        }
    }
    if (expr !== '')
        switch (mainCommand) {
            case Commands.Delete:
                    execDeleteCommands(expr)
                break
            case Commands.Show:
                    result = execShowCommands(correctCommand, expr)

    }
    return result
}

function convertCorrectPhones(phones){
    let res = []
    const phoneRegexp = /(\d{3})(\d{3})(\d{2})(\d{2})/;
    for(let phone of phones){
        res.push(phone.replace(phoneRegexp, '+7 ($1) $2-$3-$4'));
    }
    return res.join(',')
}
/**
 * Парсинг команды добавления
 * @param {string[]} command
 */
function parseAddDeleteCommand(command) {
    const mainCommand = command[0]
    command = command.slice(1)
    let correctCommand = []
    let name = ''
    let checkCom = true
    let i = 0
    while (checkCom) {
        switch (command[i]) {
            case ObjectCommandsAdd.Phone:
                addLengthCorrectWord(ObjectCommandsAdd.Phone)
                if (command[i + 1].match(phoneRegExp)) {
                    addLengthCorrectWord(command[i + 1])
                    if (command[i + 2] !== 'и' && command[i + 2] !== 'для')
                        syntaxError(lineNumber, charNumber + 1)
                    correctCommand.push([ObjectCommandsAdd.Phone, command[i + 1]])
                    i += 2
                } else syntaxError(lineNumber, charNumber + 1)
                break
            case ObjectCommandsAdd.Email:
                addLengthCorrectWord(ObjectCommandsAdd.Email)
                    addLengthCorrectWord(command[i + 1])
                if (command[i + 2] !== 'и' && command[i + 2] !== 'для')
                    syntaxError(lineNumber, charNumber + 1)
                        correctCommand.push([ObjectCommandsAdd.Email, command[i + 1]])
                    i += 2
                break
            case 'для':
                addLengthCorrectWord('для')
                if (command[i + 1] === ObjectCommandsAdd.Contact){
                    checkCom = false
                    name = command.slice(i + 2).join(' ')
                } else syntaxError(lineNumber, charNumber + 1)
                break
            case 'и':
                addLengthCorrectWord('и')
                if (command[i + 1] === 'и' || command[i + 1] === 'для')
                    syntaxError(lineNumber, charNumber + 1)
                 i += 1
                break
            default:
                syntaxError(lineNumber, charNumber + 1)
        }
    }
    if (phoneBook.has(name))
        switch (mainCommand) {
            case Commands.Add:
                execAddCommand(correctCommand, name)
                break
            case Commands.Delete:
                execDeleteCommand(correctCommand, name)
                break

    }
}
//console.log(run('Покажи имя для контактов, где есть Гр'))

module.exports = { phoneBook, run };