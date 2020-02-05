export class SnowdropError extends Error {
  constructor(message: string) {
    super(`Snowdrop: ${message}`)
  }
}

export class RemovingNonExistantHandleError extends SnowdropError {
  constructor(handleId: number) {
    super(`Trying to remove a handle that doesn\'t exist: ${handleId}`)
  }
}

export class ExceedsMaxEmitsCountError extends SnowdropError {
  constructor(maxEmitsCount: number) {
    super(`Trying to emit beyound maxEmitsCount of ${maxEmitsCount}`)
  }
}

export type handle<T> = (value: T) => void

export class Snowdrop<T> {

  readonly options: {
    maxEmitsCount: number | null
  } = {
    maxEmitsCount: null
  }

  private nextHandleId: 0
  private handlesById: { [id: number]: handle<T> } = {}
  private handlesCount: number = 0
  private emitsCount: number = 0

  constructor(options?: {
    maxEmitsCount?: number | null
  }) {
    if (options) {
      this.options = Object.assign(this.options, options)
    }
  }

  addHandle(handle: handle<T>): number {
    const handleId = this.nextHandleId
    this.handlesById[handleId] = handle
    this.nextHandleId += 1
    this.handlesCount += 1
    return handleId
  }

  removeHandleById(id: number): void {
    const handle = this.handlesById[id]
    if (!handle) {
      throw new RemovingNonExistantHandleError(id)
    }
    delete this.handlesById[id]
    this.handlesCount -= 1
  }

  removeAllHandles(): void {
    for (let value = 0; value < this.nextHandleId; value++) {
      if (this.handlesById[value]) {
        this.removeHandleById(value)
      }
    }
  }

  emit(data: T) {
    if (this.options.maxEmitsCount !== null) {
      if (this.emitsCount === this.options.maxEmitsCount) {
        throw new ExceedsMaxEmitsCountError(this.options.maxEmitsCount)
      }
    }
    this.emitsCount += 1
    for (let i = 0; i < this.nextHandleId; i++) {
      const handle = this.handlesById[i]
      if (handle) {
        handle(data)
      }
    }
  }

}
