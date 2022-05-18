export type WorkerFunction<DataType = any, ResponseType = void> = (data: DataType) => Promise<ResponseType>;

export interface AsyncQueueOptions {
    concurrency?: number;
    stopOnComplete?: boolean;
}

export class AsyncQueue<DataType = any, ResponseType = void> {
    private _data: any[];
    private _started: boolean;
    private _onFinish?: () => unknown;
    private _worker?: WorkerFunction<DataType, ResponseType>;
    private _workerCount: number;
    private _stopOnComplete: boolean;
    private _concurrency: number;

    constructor(options: AsyncQueueOptions = { concurrency: 1 }) {
        this._concurrency = 1;
        this.concurrency(options.concurrency);

        this._data = [];
        this._started = false;
        this._workerCount = 0;
        this._stopOnComplete = options.stopOnComplete === true;

        this._workerFinished = this._workerFinished.bind(this);
        this._workerFailed = this._workerFailed.bind(this);
    }

    overwrite(val: unknown[]) {
        this._data = val;
        this.update();
    }

    push(val: unknown) {
        this._data.push(val);
        this.update();
    }

    concat(val: unknown[]) {
        val.forEach((item) => {
            this._data.push(item);
        });

        this.update();
    }

    concurrency(val?: number) {
        if (val !== undefined) {
            this._concurrency = val;
            return this;
        }

        return this._concurrency;
    }

    worker(val?: WorkerFunction<DataType, ResponseType>) {
        if (val !== undefined) {
            this._worker = val;
            return this;
        }

        return this._worker;
    }

    start(onFinish?: () => unknown) {
        if (onFinish) {
            this._onFinish = onFinish;
        }

        if (this._started) {
            return;
        }

        this._started = true;
        this.update();
    }

    stop() {
        this._started = false;
    }

    update() {
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
    }

    _startWorker() {
        if (!this._data.length) {
            return;
        }

        // Grab data for new worker, removing it from
        // the existing array
        const workerData = this._data.shift();

        // Increment worker count
        this._workerCount++;

        // Fire up worker process
        setTimeout(() => {
            this._worker && this._worker(workerData).then(this._workerFinished).catch(this._workerFailed);
        }, 1);
    }

    _workerFinished() {
        // Decrement worker count
        this._workerCount--;
        this.update();
    }

    _workerFailed() {
        // Decrement worker count
        this._workerCount--;
        this.update();
    }

    finished() {
        if (this._stopOnComplete) {
            this.stop();
        }

        this._onFinish && this._onFinish();
    }
}
