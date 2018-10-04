export interface config {
  use?: string,
  pre?: string,
  expire?: number | null,
  once: boolean
}

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
  version = 'v4.0.0-alpha.3'
  LS = window.localStorage
  SS = window.sessionStorage
  defaults = {
    use: 'local',
    pre: '',
    expire: null,
    once: false
  }

  constructor () {}

  set (
    key: string | {key: string, value: any}[],
    value: any,
    config: config
  ): void {
    if (isDef(key)) {
      if (Array.isArray(key)) {
        config = this.getConfig(value)
        for (let i in key) this._set(key[i].key, key[i].value, config)
      } else {
        config = this.getConfig(config)
        this._set(key, value, config)
      }
    } else {
      tip('参数设置失败')
    }
  }

  get (
    key: string,
    config: config
  ): any {
    let value: any
    config = this.getConfig(config)
    key = this.getKey(key, config)
    if (isDef(key)) {
      let store = this.getStore(key, config)
      value = this.getStorage(config).getItem(key)
      if (store) {
        if (value) {
          if (
            (
              store.expire &&
              store.expire > new Date().getTime()
            ) ||
            store.expire === null
          ) {
            if (config.once) this._remove(key, config)
            return store.type === 'String'
              ? value
              : JSON.parse(value)
          } else {
            this._remove(key, config)
            return null
          }
        } else {
          tip(`获取 Storage 失败，key: ${key} 不存在`)
          return null
        }
      } else {
        tip('获取 Storage 异常，未能匹配到参数类型')
        try {
          return JSON.parse(value)
        } catch (_) {
          return value
            ? value
            : null
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
    config = this.getConfig(config)
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
    config = this.getConfig(config)
    if (config.pre) {
      for (let l in this.LS) {
        if (l.indexOf(config.pre) === 0) this.LS.removeItem(l)
      }
      for (let s in this.SS) {
        if (s.indexOf(config.pre) === 0) this.SS.removeItem(s)
      }
    } else {
      this.LS.clear()
      this.SS.clear()
    }
  }

  private getConfig (
    config: config
  ) {
    if (
      config &&
      config.expire &&
      /^[1-9]\d*$/.test(String(config.expire)) &&
      config.expire.toString().length !== 13
    ) {
      config.expire = config.expire + new Date().getTime()
    }
    return (<any>Object).assign({}, this.defaults, config)
  }

  private getKey (
    key: string,
    config: config
  ): string {
    return `${config.pre}${key}`
  }

  private getStorage (
    config: config
  ) {
    return /^(l|local|localStorage)$/.test(String(config.use))
      ? this.LS
      : this.SS
  }

  private getStoreName (
    config: config
  ): string {
    return `__${config.pre}_storage_web_version_${this.version}`
  }

  private store (
    config: config
  ) {
    let store: any
    store = this.getStorage(config).getItem(this.getStoreName(config))
    return store
      ? JSON.parse(store)
      : {}
  }

  private getStore (
    key: string,
    config: config
  ) {
    const store = this.store(config)
    if (store[key]) {
      return store[key]
    } else {
      tip(`当前 key: ${key} 不在 Storage 里面或值为 Null`)
    }
  }

  private setStore (
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

  private removeStore (
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

  private _set (
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

  private _remove (
    key: string,
    config: config
  ): void {
    key = this.getKey(key, config)
    this.removeStore(key, config)
    this.getStorage(config).removeItem(key)
  }
}

export default new Storages()
