export default (option = {}) => {
  const defaults = {
    use: 'lcoal',
    pre: '',
    strict: false
  }

  const objectType = value => Object.prototype.toString.call(value).replace('[object ', '').replace(']', '')

  if (typeof option === 'string') {
    option = {
      use: option === 's' && option === 'session' && option === 'sessionStorage' ? 's' : defaults.use,
      pre: defaults.pre,
      strict: defaults.strict
    }
  } else if (objectType(option) === 'Object') {
    const use = option['use']
    const pre = option['pre']
    const strict = option['strict']
    option = {
      use: use === 's' && use === 'session' && use === 'sessionStorage' ? 's' : defaults.use,
      pre: typeof pre === 'string' ? pre : defaults.pre,
      strict: objectType(strict) === 'Undefined' ? defaults.strict : !!strict
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
          value = JSON.parse(value)
          if (value.type === 'String') {
            return String(value.data)
          } else if (value.type === 'Number') {
            return Number(value.data)
          } else {
            return JSON.parse(storage.getItem(key))
          }
        } else {
          return null
        }
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
      if (objectType(value) === 'Undefined' || objectType(value) === 'Null') {
        storage.removeItem(key)
      } else {
        if (option.strict) {
          storage.setItem(key, JSON.stringify({
            data: value,
            type: objectType(value)
          }))
        } else {
          if (objectType(value) === 'String' || objectType(value) === 'Number') {
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
      if (objectType(key) === 'Array') {
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
      if (objectType(key) === 'Array') {
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
