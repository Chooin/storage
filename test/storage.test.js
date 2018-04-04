require('jest-localstorage-mock')
const storage = require('../lib/storage.ts')

const clearStorage = () => {
  window.localStorage.clear()
  window.sessionStorage.clear()
}

test('.set(key, value)', () => {
  storage.default.set('a', 1)
  const a = storage.default.get('a')
  clearStorage()
  expect(a).toBe('1')
})

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
  let _number = window.localStorage.getItem('Number')
  let _object = window.localStorage.getItem('Object')
  let _array = window.localStorage.getItem('Array')
  let _boolean = window.localStorage.getItem('Boolean')
  let _string = window.localStorage.getItem('String')
  let _undefined = window.localStorage.getItem('Undefined')
  let _null = window.localStorage.getItem('Null')
  clearStorage()
  expect(_number).toBe('0')
  expect(_object).toBe('{}')
  expect(_array).toBe('[]')
  expect(_boolean).toBe('false')
  expect(_string).toBe('0')
  expect(String(_undefined)).toBe('null')
  expect(String(_null)).toBe('null')
})
