import { Snowdrop } from './index'

test('snowdrop', () => {
  const snowdrop = new Snowdrop<void>()
  let emittedCount = 0
  snowdrop.addHandle(() => {
    emittedCount += 1
  })
  snowdrop.emit()
  expect(emittedCount).toBe(1)
})
