require('jest-localstorage-mock')
const storage = require('../lib/storage.ts')

afterEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
})

// test('.set(key, value)', () => {
//   storage.default.set('a', 1)
//   const a = storage.default.get('a')
//   expect(a).toBe('1')
// })

test('.set([{key, value}])', () => {
  storage.default.set([
    {
      key: 'Number', value: 0
    },
    {
      key: 'Object', value: {}
    },
    {
      key: 'Array', value: []
    },
    {
      key: 'Boolean', value: false
    },
    {
      key: 'String', value: '0'
    },
    {
      key: 'Undefined', value: undefined
    },
    {
      key: 'Null', value: null
    }
  ])
  expect(storage.default.get('Number')).toEqual(0)
  expect(storage.default.get('Object')).toEqual({})
  expect(storage.default.get('Array')).toEqual([])
  expect(storage.default.get('Boolean')).toBeFalsy()
  expect(storage.default.get('String')).toEqual('0')
  expect(storage.default.get('Undefined')).toBeNull()
  expect(storage.default.get('Null')).toBeNull()
})
