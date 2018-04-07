require('jest-localstorage-mock')
const storage = require('../lib/storage.ts')

afterEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
})

test('.get(key)', () => {
  storage.default.set('Number', 0)
  expect(window.localStorage.getItem('Number')).toEqual('0')
  expect(storage.default.get('Number')).toEqual(0)

  storage.default.set('Object', {})
  expect(window.localStorage.getItem('Object')).toEqual('{}')
  expect(storage.default.get('Object')).toEqual({})

  storage.default.set('Array', [])
  expect(window.localStorage.getItem('Array')).toEqual('[]')
  expect(storage.default.get('Array')).toEqual([])

  storage.default.set('Boolean', false)
  expect(window.localStorage.getItem('Boolean')).toEqual('false')
  expect(storage.default.get('Boolean')).toBeFalsy()

  storage.default.set('String', '0')
  expect(window.localStorage.getItem('String')).toEqual('0')
  expect(storage.default.get('String')).toEqual('0')

  storage.default.set('Undefined', undefined)
  expect(window.localStorage.getItem('Undefined')).toBeNull()
  expect(window.localStorage.getItem('Undefined')).toBeNull()

  storage.default.set('Null', null)
  expect(window.localStorage.getItem('Null')).toBeNull()
  expect(window.localStorage.getItem('Null')).toBeNull()
})

test('.get(key, config)', () => {
  const pre = '1.get(key, config)'

  storage.default.set('Number', 0, { pre })
  expect(window.localStorage.getItem(`${pre}Number`)).toEqual('0')
  expect(storage.default.get('Number', { pre })).toEqual(0)

  storage.default.set('Object', {}, { pre })
  expect(window.localStorage.getItem(`${pre}Object`)).toEqual('{}')
  expect(storage.default.get('Object', { pre })).toEqual({})

  storage.default.set('Array', [], { pre })
  expect(window.localStorage.getItem(`${pre}Array`)).toEqual('[]')
  expect(storage.default.get('Array', { pre })).toEqual([])

  storage.default.set('Boolean', false, { pre })
  expect(window.localStorage.getItem(`${pre}Boolean`)).toEqual('false')
  expect(storage.default.get('Boolean', { pre })).toBeFalsy()

  storage.default.set('String', '0', { pre })
  expect(window.localStorage.getItem(`${pre}String`)).toEqual('0')
  expect(storage.default.get('String', { pre })).toEqual('0')

  storage.default.set('Undefined', undefined, { pre })
  expect(window.localStorage.getItem(`${pre}Undefined`)).toBeNull()
  expect(window.localStorage.getItem('Undefined', { pre })).toBeNull()

  storage.default.set('Null', null, { pre })
  expect(window.localStorage.getItem(`${pre}Null`)).toBeNull()
  expect(window.localStorage.getItem('Null', { pre })).toBeNull()
})
