"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncQueue = void 0;
var AsyncQueue = /** @class */ (function () {
    function AsyncQueue(options) {
        if (options === void 0) { options = { concurrency: 1 }; }
        this._concurrency = 1;
        this.concurrency(options.concurrency);
        this._data = [];
        this._started = false;
        this._workerCount = 0;
        this._stopOnComplete = options.stopOnComplete === true;
        this._workerFinished = this._workerFinished.bind(this);
        this._workerFailed = this._workerFailed.bind(this);
    }
    AsyncQueue.prototype.overwrite = function (val) {
        this._data = val;
        this.update();
    };
    AsyncQueue.prototype.push = function (val) {
        this._data.push(val);
        this.update();
    };
    AsyncQueue.prototype.concat = function (val) {
        var _this = this;
        val.forEach(function (item) {
            _this._data.push(item);
        });
        this.update();
    };
    AsyncQueue.prototype.concurrency = function (val) {
        if (val !== undefined) {
            this._concurrency = val;
            return this;
        }
        return this._concurrency;
    };
    AsyncQueue.prototype.worker = function (val) {
        if (val !== undefined) {
            this._worker = val;
            return this;
        }
        return this._worker;
    };
    AsyncQueue.prototype.start = function (onFinish) {
        if (onFinish) {
            this._onFinish = onFinish;
        }
        if (this._started) {
            return;
        }
        this._started = true;
        this.update();
    };
    AsyncQueue.prototype.stop = function () {
        this._started = false;
    };
    AsyncQueue.prototype.update = function () {
        if (!this._started) {
            return;
        }
        if (this._workerCount >= this.concurrency()) {
            return;
        }
        if (!this._data.length) {
            if (this._workerCount === 0) {
                this.finished();
            }
            return;
        }
        this._startWorker();
        this.update();
    };
    AsyncQueue.prototype._startWorker = function () {
        var _this = this;
        if (!this._data.length) {
            return;
        }
        // Grab data for new worker, removing it from
        // the existing array
        var workerData = this._data.shift();
        // Increment worker count
        this._workerCount++;
        // Fire up worker process
        setTimeout(function () {
            _this._worker && _this._worker(workerData).then(_this._workerFinished).catch(_this._workerFailed);
        }, 1);
    };
    AsyncQueue.prototype._workerFinished = function () {
        // Decrement worker count
        this._workerCount--;
        this.update();
    };
    AsyncQueue.prototype._workerFailed = function () {
        // Decrement worker count
        this._workerCount--;
        this.update();
    };
    AsyncQueue.prototype.finished = function () {
        if (this._stopOnComplete) {
            this.stop();
        }
        this._onFinish && this._onFinish();
    };
    return AsyncQueue;
}());
exports.AsyncQueue = AsyncQueue;
