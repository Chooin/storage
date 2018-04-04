require('jest-localstorage-mock')
const storage = require('../lib/storage.ts')

afterEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
})

test('.clear()', () => {
  storage.default.set('Number', 0)
  storage.default.set('String', '0')
  storage.default.clear()
  expect(window.localStorage.getItem('Number')).toBeNull()
  expect(window.localStorage.getItem('String')).toBeNull()
})

test('.clear(config)', () => {
  const config = {
    pre: '1test_'
  }
  const config2 = {
    pre: '2text_'
  }
  storage.default.set('Number', 0, config)
  storage.default.set('Number', 0, config2)
  storage.default.clear(config)
  expect(window.localStorage.getItem('1test_Number')).toBeNull()
  expect(window.localStorage.getItem('2text_Number')).toEqual('0')
})
