require('jest-localstorage-mock')
const storage = require('../lib/storage.ts')

afterEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
})

test('.get(key)', () => {
  storage.default.set('Number', 0)
  expect(storage.default.get('Number')).toEqual(0)
  storage.default.set('Object', {})
  expect(storage.default.get('Object')).toEqual({})
  storage.default.set('Array', [])
  expect(storage.default.get('Array')).toEqual([])
  storage.default.set('Boolean', false)
  expect(storage.default.get('Boolean')).toBeFalsy()
  storage.default.set('String', '0')
  expect(storage.default.get('String')).toEqual('0')
  storage.default.set('Undefined', undefined)
  expect(window.localStorage.getItem('Undefined')).toBeNull()
  storage.default.set('Null', null)
  expect(window.localStorage.getItem('Null')).toBeNull()
})

test('.get(key, config)', () => {
  const config = {
    pre: 'test_'
  }
  storage.default.set('Number', 0, config)
  expect(storage.default.get('Number', config)).toEqual(0)
  storage.default.set('Object', {})
  expect(storage.default.get('Object')).toEqual({})
  storage.default.set('Array', [])
  expect(storage.default.get('Array')).toEqual([])
  storage.default.set('Boolean', false)
  expect(storage.default.get('Boolean')).toBeFalsy()
  storage.default.set('String', '0')
  expect(storage.default.get('String')).toEqual('0')
  storage.default.set('Undefined', undefined)
  expect(window.localStorage.getItem('Undefined')).toBeNull()
  storage.default.set('Null', null)
  expect(window.localStorage.getItem('Null')).toBeNull()
})
