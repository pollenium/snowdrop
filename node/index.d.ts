export declare class SnowdropError extends Error {
    constructor(message: string);
}
export declare class EmitWithoutHandlesError extends SnowdropError {
    constructor();
}
export declare class RemovingNonExistantHandleError extends SnowdropError {
    constructor(handleId: HandleId);
}
export declare type handle<T> = (T: any) => void;
export declare class HandleId {
    readonly value: number;
    constructor(value: number);
    genNext(): HandleId;
}
export declare class Snowdrop<T> {
    private nextHandleId;
    private handlesById;
    private handlesCount;
    addHandle(handle: handle<T>): HandleId;
    removeHandleById(id: HandleId): void;
    emit(data: T): void;
    emitIfHandle(data: T): void;
}
