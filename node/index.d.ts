export declare class SnowdropError extends Error {
    constructor(message: string);
}
export declare class EmitWithoutHandlesError extends SnowdropError {
    constructor();
}
export declare class RemovingNonExistantHandleError extends SnowdropError {
    constructor(handleId: HandleId);
}
export declare class ExceedsMaxEmitsCountError extends SnowdropError {
    constructor(maxEmitsCount: number);
}
export declare type handle<T> = (T: any) => void;
export declare class HandleId {
    readonly value: number;
    constructor(value: number);
    genNext(): HandleId;
}
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
    addHandle(handle: handle<T>): HandleId;
    removeHandleById(id: HandleId): void;
    removeAllHandles(): void;
    emit(data: T): void;
    emitIfHandle(data: T): void;
}
