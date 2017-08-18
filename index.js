export default (use = 'local', option) => {
  option = Object.assign({
    pre: ''
  }, option)

  let storage
  switch (use) {
    case 's':
    case 'session':
    case 'sessionStorage': {
      storage = window.sessionStorage
      break
    }
    default: {
      storage = window.localStorage
    }
  }

  const get = (key) => {
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

  const _remove = (key) => {
    if (key) {
      storage.removeItem(`${option.pre}${key}`)
    } else {
      console.warn('Wrong remove storage')
    }
  }

  const remove = (key) => {
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
    for (var i = 0; i < storage.length; i++) {
      if (storage.key(i).indexOf(option.pre) === 0) _remove(storage.key(i))
    }
  }

  const clearAll = () => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  }

  return {
    get,
    set,
    remove,
    clear,
    clearAll
  }
}
