require('jest-localstorage-mock')
const storage = require('../lib/storage.ts')

test('.set() Number', () => {
  storage.default.set('a', 1)
  const a = storage.default.get('a')
  expect(a).toBe('1')
})
