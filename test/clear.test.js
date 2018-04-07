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
  const pre = '1.clear(config)'
  const pre_2 = '2.clear(config)'
  storage.default.set('Number', 0, {
    pre
  })
  storage.default.set('Number', 0, {
    pre: pre_2
  })
  storage.default.clear({
    pre
  })
  expect(window.localStorage.getItem(`${pre}Number`)).toBeNull()
  expect(window.localStorage.getItem(`${pre_2}Number`)).toEqual('0')
})
