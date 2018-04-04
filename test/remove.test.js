require('jest-localstorage-mock')
const storage = require('../lib/storage.ts')

afterEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
})

test('.remove(key)', () => {
})

test('.remove(key, config)', () => {
})

test('.remove([key], config)', () => {
})
