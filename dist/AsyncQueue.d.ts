export declare type WorkerFunction<DataType = any, ResponseType = void> = (data: DataType) => Promise<ResponseType>;
export interface AsyncQueueOptions {
    concurrency?: number;
    stopOnComplete?: boolean;
}
export declare class AsyncQueue<DataType = any, ResponseType = void> {
    private _data;
    private _started;
    private _onFinish?;
    private _worker?;
    private _workerCount;
    private _stopOnComplete;
    private _concurrency;
    constructor(options?: AsyncQueueOptions);
    overwrite(val: unknown[]): void;
    push(val: unknown): void;
    concat(val: unknown[]): void;
    concurrency(val?: number): number | this;
    worker(val?: WorkerFunction<DataType, ResponseType>): this | WorkerFunction<DataType, ResponseType> | undefined;
    start(onFinish?: () => unknown): void;
    stop(): void;
    update(): void;
    _startWorker(): void;
    _workerFinished(): void;
    _workerFailed(): void;
    finished(): void;
}
