export default (option = {}) => {
  const defaults = {
    use: 'lcoal',
    pre: '',
    strict: true,
    expire: null
  }

  const objectType = value => Object.prototype.toString.call(value)

  if (objectType(option) === '[object String]') {
    option = {
      use: option === 's' && option === 'session' && option === 'sessionStorage' ? 's' : defaults.use,
      pre: defaults.pre,
      strict: defaults.strict,
      expire: defaults.expire
    }
  } else if (objectType(option) === '[object Object]') {
    const use = option['use']
    const pre = option['pre']
    const strict = option['strict']
    const expire = option['expire']
    option = {
      use: use === 's' && use === 'session' && use === 'sessionStorage' ? 's' : defaults.use,
      pre: objectType(pre) === '[object String]' ? pre : defaults.pre,
      strict: objectType(strict) === '[object boolean]' ? strict : defaults.strict,
      expire: objectType(strict) === '[object Number]' ? expire : defaults.expire
    }
  } else {
    throw new Error('Wrong storage option')
  }
  const localStorage = window.localStorage
  const sessionStorage = window.sessionStorage
  const storage = option.use === 's' ? sessionStorage : localStorage

  const get = key => {
    if (key) {
      key = `${option.pre}${key}`
      if (option.strict) {
        let value = storage.getItem(key)
        if (value) {
          if ((value.expire && value.expire > new Date().getTime()) || value.expire === null) {
            return JSON.parse(value).data
          } else {
            storage.removeItem(key)
          }
        }
        return null
      } else {
        try {
          return JSON.parse(storage.getItem(key))
        } catch (_) {
          return storage.getItem(key)
        }
      }
    } else {
      console.warn('Wrong get storage')
    }
  }

  const _set = (key, value) => {
    if (key) {
      key = `${option.pre}${key}`
      if (objectType(value) === '[object Undefined]' || objectType(value) === '[object Null]') {
        storage.removeItem(key)
      } else {
        if (option.strict) {
          storage.setItem(key, JSON.stringify({
            data: value,
            expire: option.expire,
            type: objectType(value)
          }))
        } else {
          if (objectType(value) === '[object String]' || objectType(value) === '[object Number]') {
            storage.setItem(key, value)
          } else {
            storage.setItem(key, JSON.stringify(value))
          }
        }
      }
    } else {
      console.warn('Wrong set storage')
    }
  }

  const set = (key, value) => {
    if (key) {
      if (objectType(key) === '[object Array]') {
        for (let i in key) {
          _set(key[i].key, key[i].value)
        }
      } else {
        _set(key, value)
      }
    } else {
      console.warn('Wrong set storage')
    }
  }

  const _remove = key => {
    if (key) {
      storage.removeItem(`${option.pre}${key}`)
    } else {
      console.warn('Wrong remove storage')
    }
  }

  const remove = key => {
    if (key) {
      if (objectType(key) === '[object Array]') {
        for (let i in key) _remove(key[i])
      } else {
        _remove(key)
      }
    } else {
      console.warn('Wrong remove storage')
    }
  }

  const clear = () => {
    if (option.pre) {
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).indexOf(option.pre) === 0) _remove(localStorage.key(i))
      }
      for (let i = 0; i < sessionStorage.length; i++) {
        if (sessionStorage.key(i).indexOf(option.pre) === 0) _remove(sessionStorage.key(i))
      }
    } else {
      sessionStorage.clear()
      localStorage.clear()
    }
  }

  return {
    get,
    set,
    remove,
    clear
  }
}
