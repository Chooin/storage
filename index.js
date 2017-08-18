export default (option = {}) => {
  if (typeof option === 'string') {
    option = {
      use: option === 's' && option === 'session' && option === 'sessionStorage' ? 's' : 'local',
      pre: ''
    }
  } else if (Object.prototype.toString.call(option) === '[object Object]') {
    const use = option['use']
    const pre = option['pre']
    option = {
      use: use === 's' && use === 'session' && use === 'sessionStorage' ? 's' : 'local',
      pre: typeof pre === 'string' ? pre : ''
    }
  } else {
    throw new Error(`Wrong storage option`)
  }
  let localStorage = window.localStorage
  let sessionStorage = window.sessionStorage
  let storage = option.use === 's' ? sessionStorage : localStorage

  const get = key => {
    if (key) {
      try {
        return JSON.parse(storage.getItem(`${option.pre}${key}`))
      } catch (_) {
        return storage.getItem(`${option.pre}${key}`)
      }
    } else {
      console.warn('Wrong get storage')
    }
  }

  const _set = (key, value) => {
    if (key) {
      if (typeof value === 'undefined' || value === undefined || value === null) {
        storage.removeItem(`${option.pre}${key}`)
      } else {
        if (typeof value === 'object') {
          storage.setItem(`${option.pre}${key}`, JSON.stringify(value))
        } else {
          storage.setItem(`${option.pre}${key}`, value)
        }
      }
    } else {
      console.warn('Wrong set storage')
    }
  }

  const set = (key, value) => {
    if (key) {
      if (Array.isArray(key)) {
        for (let i in key) _set(key[i].key, key[i].value)
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
      if (Array.isArray(key)) {
        for (let i in key) _remove(key[i])
      } else {
        _remove(key)
      }
    } else {
      console.warn('Wrong remove storage')
    }
  }

  const clear = () => {
    for (let i = 0; i < storage.length; i++) {
      if (storage.key(i).indexOf(option.pre) === 0) _remove(storage.key(i))
    }
  }

  const clearAll = () => {
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
    clear,
    clearAll
  }
}
