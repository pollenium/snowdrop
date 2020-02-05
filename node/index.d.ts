export declare class SnowdropError extends Error {
    constructor(message: string);
}
export declare class RemovingNonExistantHandleError extends SnowdropError {
    constructor(handleId: number);
}
export declare class ExceedsMaxEmitsCountError extends SnowdropError {
    constructor(maxEmitsCount: number);
}
export declare type handle<T> = (value: T) => void;
export declare class Snowdrop<T> {
    readonly options: {
        maxEmitsCount: number | null;
    };
    private nextHandleId;
    private handlesById;
    private handlesCount;
    private emitsCount;
    constructor(options?: {
        maxEmitsCount?: number | null;
    });
    addHandle(handle: handle<T>): number;
    removeHandleById(id: number): void;
    removeAllHandles(): void;
    emit(data: T): void;
}
