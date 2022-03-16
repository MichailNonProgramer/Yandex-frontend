'use strict';


  Итератор по друзьям
  @constructor
  @param {Object[]} friends
  @param {Filter} filter
 
function Iterator(friends, filter) {
    this.friends = getGuestList(friends, this.maxLevel).filter(filter.e);
}
Iterator.prototype.done = function() {
    return !this.friends.length;
}
Iterator.prototype.next = function (){
    if (this.done())
        return null;
    return this.friends.shift();
}

function getFriends(friends, name) {
    return friends.filter(friend = name.includes(friend.name)).sort((first, second) = first.name.localeCompare(second.name))
}

function getName(friend_list, names) {
    return friend_list
        .reduce((acc, next) = acc.concat(next.friends), [])
        .filter(name = !names.has(name));
}

function getGuestList(friends, circleLimit = Infinity) {
    let friend_list = friends.filter(friend = friend.best).sort((first, second) = first.name.localeCompare(second.name));
    let names = new Set();
    let res = [];
    let currentLevel = circleLimit;
    while (currentLevel--  0 && friend_list.length  0) {
        res.push(...friend_list);
        res.forEach(friend = names.add(friend.name));
        let name = getName(friend_list, names)
        friend_list = getFriends(friends, name)
    }

    return res;
}

  Итератор по друзям с ограничением this.friends = по кругу
  @extends Iterator
  @constructor
  @param {Object[]} friends
  @param {Filter} filter
  @param {Number} maxLevel – максимальный круг друзей
 
function LimitedIterator(friends, filter, maxLevel) {
    this.maxLevel = maxLevel;
    this.friends = getGuestList(friends, maxLevel).filter(filter.e);

}
LimitedIterator.prototype = Object.create(Iterator.prototype)

  Фильтр друзей
  @constructor
 
function Filter() {
    this.e = () = true
}


  Фильтр друзей
  @extends Filter
  @constructor
 
function MaleFilter() {
    this.e = x = x.gender === 'male'
}
MaleFilter.prototype = Object.create(Filter.prototype)
MaleFilter.prototype.constructor = MaleFilter

  Фильтр друзей-девушек
  @extends Filter
  @constructor
 
function FemaleFilter() {
    this.e = x = x.gender === 'female'
}
FemaleFilter.prototype = Object.create(Filter.prototype)
FemaleFilter.prototype.constructor = FemaleFilter

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;

module.exports = {
    Iterator,
    LimitedIterator,
    MaleFilter,
    FemaleFilter,
    Filter
};