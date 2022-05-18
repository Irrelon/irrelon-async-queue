"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncQueue = void 0;
var AsyncQueue = /** @class */ (function () {
    function AsyncQueue(options) {
        if (options === void 0) { options = { concurrency: 1 }; }
        var _this = this;
        this._concurrency = 1;
        this._worker = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); };
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
            _this._worker(workerData).then(_this._workerFinished).catch(_this._workerFailed);
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
