"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AsyncQueue_1 = require("../dist/AsyncQueue");
var queue = new AsyncQueue_1.AsyncQueue({
    concurrency: 2,
    stopOnComplete: false
});
queue.worker(function (data) {
    return new Promise(function (resolve) {
        console.log('Worker was given data', data);
        setTimeout(function () {
            if (data === 3) {
                queue.push(6);
            }
            void resolve(undefined);
        }, 1000);
    });
});
queue.concat([1, 2, 3, 4, 5]);
queue.start(function () {
    console.log('Queue complete');
});
