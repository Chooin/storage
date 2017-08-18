export default (use = 'local', pre = '') => {
  let storage
  switch (use) {
    case 's':
    case 'session':
    case 'sessionStorage':
      storage = window.sessionStorage
      break
    default:
      storage = window.localStorage
  }

  const get = (key) => {
    if (key) {
      try {
        return JSON.parse(storage.getItem(`${pre}${key}`))
      } catch (err) {
        return storage.getItem(`${pre}${key}`)
      }
    } else {
      console.warn('Wrong get storage')
    }
  }

  const set = (key, value) => {
    if (key) {
      if (typeof value === 'undefined' || value === undefined || value === null) {
        storage.removeItem(`${pre}${key}`)
      } else {
        if (typeof value === 'object') {
          storage.setItem(`${pre}${key}`, JSON.stringify(value))
        } else {
          storage.setItem(`${pre}${key}`, value)
        }
      }
    } else {
      console.warn('Wrong set storage')
    }
  }

  const sets = (objs = []) => {
    if (objs.length > 0) {
      for (let i in objs) set(objs[i].key, objs[i].value)
    } else {
      console.warn('Wrong set storage')
    }
  }

  const remove = (key) => {
    if (key) {
      storage.removeItem(`${pre}${key}`)
    } else {
      console.warn('Wrong remove storage')
    }
  }

  const removes = (keys = []) => {
    if (keys.length > 0) {
      for (let i in keys) remove(keys[i])
    } else {
      console.warn('Wrong remove storage')
    }
  }

  const clear = () => {
    for (var i = 0; i < storage.length; i++) {
      remove(storage.key(i))
    }
  }

  const clearAll = () => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  }

  return {
    get,
    set,
    sets,
    remove,
    removes,
    clear,
    clearAll
  }
}
