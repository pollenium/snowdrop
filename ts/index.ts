export class SnowdropError extends Error {
  constructor(message: string) {
    super(`Snowdrop: ${message}`)
  }
}

export class EmitWithoutHandlesError extends SnowdropError {
  constructor() {
    super('Emitted without any handles')
  }
}

export class RemovingNonExistantHandleError extends SnowdropError {
  constructor(handleId: HandleId) {
    super(`Trying to remove a handle that doesn\'t exist: ${handleId.value}`)
  }
}


export type handle<T> = (T) => void;

export class HandleId {
  constructor(readonly value: number) {}

  genNext() {
    return new HandleId(this.value + 1)
  }
}

export class Snowdrop<T> {

  private nextHandleId: HandleId = new HandleId(0)
  private handlesById: { [key: number]: handle<T> } = {}
  private handlesCount: number = 0

  addHandle(handle: handle<T>): HandleId {
    const handleId = this.nextHandleId
    this.handlesById[handleId.value] = handle
    this.nextHandleId = this.nextHandleId.genNext()
    this.handlesCount += 1
    return handleId
  }

  removeHandleById(id: HandleId): void {
    const handle = this.handlesById[id.value]
    if (!handle) {
      throw new RemovingNonExistantHandleError(id)
    }
    delete this.handlesById[id.value]
    this.handlesCount -= 1
  }

  removeAllHandles(): void {
    for (let value = 0; value < this.nextHandleId.value; value++) {
      if (this.handlesById[value]) {
        this.removeHandleById(new HandleId(value))
      }
    }
  }

  emit(data: T) {
    if (this.handlesCount === 0) {
      throw new EmitWithoutHandlesError()
    }
    for (let i = 0; i < this.nextHandleId.value; i++) {
      const handle = this.handlesById[i]
      if (handle) {
        handle(data)
      }
    }
  }

  emitIfHandle(data: T) {
    if (this.nextHandleId.value > 0) {
      this.emit(data)
    }
  }

}
