// реализация "очереди"
function Queue() {
    this._oldestIndex = 0;
    this._newestIndex = 0;
    this._storage = {};
}
Queue.prototype.getSize = function() {
    return this._newestIndex - this._oldestIndex;
}
Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
}
Queue.prototype.dequeue = function() {
    if (this._oldestIndex !== this._newestIndex) {
        var data = this._storage[this._oldestIndex];
        delete this._storage[this._oldestIndex];
        this._oldestIndex++;
        return data;
    } else return null;
}
Queue.prototype.getAll = function() {
    return this._storage;
}
// -----------
export default Queue;