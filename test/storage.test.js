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
  console.log('👇👇👇', '设置 Undefined', undefined)
  storage.default.set('Undefined', undefined)
  expect(storage.default.get('Undefined')).toBeNull()
  console.log('👇👇👇', '设置 Null', null)
  storage.default.set('Null', null)
  expect(storage.default.get('Null')).toBeNull()
})

test('.get(key, config)', () => {
  storage.default.set('Number', 0, {
    pre: 'test_'
  })
  expect(storage.default.get('Number', {
    pre: 'test_'
  })).toEqual(0)
  storage.default.set('Object', {})
  expect(storage.default.get('Object')).toEqual({})
  storage.default.set('Array', [])
  expect(storage.default.get('Array')).toEqual([])
  storage.default.set('Boolean', false)
  expect(storage.default.get('Boolean')).toBeFalsy()
  storage.default.set('String', '0')
  expect(storage.default.get('String')).toEqual('0')
  console.log('👇👇👇', '设置 Undefined', undefined)
  storage.default.set('Undefined', undefined)
  expect(storage.default.get('Undefined')).toBeNull()
  console.log('👇👇👇', '设置 Null', null)
  storage.default.set('Null', null)
  expect(storage.default.get('Null')).toBeNull()
})

test('.set(key, value)', () => {
  storage.default.set('Number', 0)
  expect(window.localStorage.getItem('Number')).toEqual('0')
  storage.default.set('Object', {})
  expect(window.localStorage.getItem('Object')).toEqual('{}')
  storage.default.set('Array', [])
  expect(window.localStorage.getItem('Array')).toEqual('[]')
  storage.default.set('Boolean', false)
  expect(window.localStorage.getItem('Boolean')).toEqual('false')
  storage.default.set('String', '0')
  expect(window.localStorage.getItem('String')).toEqual('0')
  storage.default.set('Undefined', undefined)
  expect(window.localStorage.getItem('Undefined')).toBeNull()
  storage.default.set('Null', null)
  expect(window.localStorage.getItem('Null')).toBeNull()
})

test('.set([{key, value}])', () => {
  storage.default.set([
    { key: 'Number', value: 0 },
    { key: 'Object', value: {} },
    { key: 'Array', value: [] },
    { key: 'Boolean', value: false },
    { key: 'String', value: '0' },
    { key: 'Undefined', value: undefined },
    { key: 'Null', value: null }
  ])
  expect(storage.default.get('Number')).toEqual(0)
  expect(storage.default.get('Object')).toEqual({})
  expect(storage.default.get('Array')).toEqual([])
  expect(storage.default.get('Boolean')).toBeFalsy()
  expect(storage.default.get('String')).toEqual('0')
  console.log('👇👇👇', '设置 Undefined', undefined)
  expect(storage.default.get('Undefined')).toBeNull()
  console.log('👇👇👇', '设置 Null', null)
  expect(storage.default.get('Null')).toBeNull()
})

test('.remove()', () => {
})

test('.remove([])', () => {
})

test('.clear()', () => {
})
