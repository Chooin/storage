interface config {
  use?: string,
  pre?: string,
  expire?: number | null
}

const $LS = window.localStorage
const $SS = window.sessionStorage

function isDef (v: any): boolean {
  return typeof v !== 'undefined' && v !== null
}

function getObjectType (v: any): string {
  return Object.prototype.toString.call(v).slice(8, -1)
}

function tip (v: string): void {
  if (typeof console !== 'undefined') console.warn(`[Tip]: ${v}`)
}

class Storages {
  version = 'v4.0.0'
  defaults = {
    use: 'local',
    pre: '',
    expire: null
  }

  constructor () {}

  getConfig (
    config: config
  ) {
    return (<any>Object).assign({}, this.defaults, config)
  }

  getKey (
    key: string,
    config: config
  ): string {
    return `${this.getConfig(config).pre}${key}`
  }

  getStorage (
    config: config
  ) {
    return /^(l|local|localStorage)$/.test(this.getConfig(config).use)
      ? $LS
      : $SS
  }

  getStoreName (
    config: config
  ): string {
    return `__${this.getConfig(config).pre}_storage_web_version_${this.version}`
  }

  set (
    key: string | {key: string, value: any}[],
    value: any,
    config: config
  ): void {
    if (isDef(key)) {
      if (Array.isArray(key)) {
        for (let i in key) this._set(key[i].key, key[i].value, config)
      } else {
        this._set(key, value, config)
      }
    } else {
      tip('Wrong set storage')
    }
  }

  get (
    key: string,
    config: config
  ): any {
    let value: any
    key = this.getKey(key, config)
    if (isDef(key)) {
      let store = this.getStore(key, config)
      let value = this.getStorage(config).getItem(key)
      if (store) {
        if (value) {
          return store.type === 'String'
            ? value
            : JSON.parse(value)
        } else {
          tip('获取 Storage 失败，Storage 中不存在该 key')
          return null
        }
      } else {
        try {
          return value ? JSON.parse(value) : null
        } catch (_) {
          this._remove(key, config)
          return null
        }
      }
    } else {
      tip('获取 Storage 失败，key 不能为空')
    }
  }

  remove (
    key: string | string[],
    config: config
  ): void {
    if (Array.isArray(key)) {
      for (let i in key) {
        this._remove(key[i], config)
      }
    } else {
      this._remove(key, config)
    }
  }

  clear (
    config: config
  ): void {
    const pre = this.getConfig(config).pre
    if (pre) {
      for (let l in $LS) {
        if (l.indexOf(pre) === 0) $LS.removeItem(l)
      }
      for (let s in $SS) {
        if (s.indexOf(pre) === 0) $SS.removeItem(s)
      }
    } else {
      $LS.clear()
      $SS.clear()
    }
  }

  store (
    config: config
  ) {
    let store: any
    store = this.getStorage(config).getItem(this.getStoreName(config))
    return store
      ? JSON.parse(store)
      : {}
  }

  getStore (
    key: string,
    config: config
  ) {
    const store = this.store(config)
    if (store[key]) {
      return store[key]
    } else {
      tip('当前 key 不在 Storage 里面或当前 key 对应的值为 Null')
    }
  }

  setStore (
    key: string,
    type: string,
    config: config
  ): void {
    const store = this.store(config)
    store[key] = {
      type,
      expire: this.getConfig(config).expire
    }
    this.getStorage(config).setItem(
      this.getStoreName(config),
      JSON.stringify(store)
    )
  }

  removeStore (
    key: string,
    config: config
  ): void {
    const store = this.store(config)
    delete store[key]
    this.getStorage(config).setItem(
      this.getStoreName(config),
      JSON.stringify(store)
    )
  }

  _set (
    key: string,
    value: any,
    config: config
  ): void {
    if (isDef(key)) {
      key = this.getKey(key, config)
      let storage = this.getStorage(config)
      if (isDef(value)) {
        let type = getObjectType(value)
        this.setStore(key, type, config)
        if (
          type === 'String' ||
          type === 'Number'
        ) {
          storage.setItem(key, value)
        } else {
          storage.setItem(key, JSON.stringify(value))
        }
      } else {
        this._remove(key, config)
      }
    } else {
      tip('设置 Storage 失败，key 不能为空')
    }
  }

  _remove (
    key: string,
    config: config
  ): void {
    key = this.getKey(key, config)
    this.removeStore(key, config)
    this.getStorage(config).removeItem(key)
  }
}

export default new Storages()
