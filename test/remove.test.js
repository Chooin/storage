require('jest-localstorage-mock')
const storage = require('../lib/storage.ts')

afterEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
})

test('.remove(key)', () => {
  storage.default.set('String', '0')
  expect(window.localStorage.getItem('String')).toEqual('0')
  storage.default.remove('String')
  expect(window.localStorage.getItem('String')).toBeNull()
})

test('.remove(key, config)', () => {
  const pre = '1.remove(key, config)_'
  storage.default.set('String', '0', {
    pre
  })
  expect(window.localStorage.getItem(`${pre}String`)).toEqual('0')
  storage.default.remove('String', {
    pre
  })
  expect(window.localStorage.getItem(`${pre}String`)).toBeNull()
})

test('.remove([key])', () => {
  storage.default.set('String', '0')
  storage.default.set('Number', 0)
  expect(window.localStorage.getItem('String')).toEqual('0')
  expect(window.localStorage.getItem('Number')).toEqual('0')
  storage.default.remove(['String', 'Number'])
  expect(window.localStorage.getItem('String')).toBeNull()
  expect(window.localStorage.getItem('Number')).toBeNull()
})

test('.remove([key], config)', () => {
  const pre = '1.remove([key], config)_'
  storage.default.set('String', '0', {
    pre
  })
  storage.default.set('Number', 0, {
    pre
  })
  expect(window.localStorage.getItem(`${pre}String`)).toEqual('0')
  expect(window.localStorage.getItem(`${pre}Number`)).toEqual('0')
  storage.default.remove(['String', 'Number'], {
    pre
  })
  expect(window.localStorage.getItem(`${pre}String`)).toBeNull()
  expect(window.localStorage.getItem(`${pre}Number`)).toBeNull()
})
