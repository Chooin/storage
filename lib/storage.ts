interface config {
  use?: string,
  pre?: string,
  export?: number
}

const $LS = window.localStorage
const $SS = window.sessionStorage

function isDef (v: any): boolean {
  return typeof v !== 'undefined' && v !== null
}

function getObjectType (v: any): string {
  return Object.prototype.toString.call(v).slice(8, -1)
}

function tip (v: any): void {
  if (typeof console !== 'undefined') console.warn(`[Tip]: ${v}`)
}

class Storages {
  defaults: object

  constructor () {
    this.defaults = {
      use: 'local',
      pre: '',
      expire: null
    }
  }

  set (key: string | object[], value: any, config: config) {
    if (isDef(key)) {

    } else {
      tip('Wrong set storage')
    }
  }

  get (key: string, config: config) {
    if (isDef(key)) {
    } else {
      tip('Wrong get storage')
    }
  }

  remove (key: string | string[], config: config) {
    if (Array.isArray(key)) {

    } else {
      this._remove(key, config)
    }
  }

  clear (config: config) {

  }

  _set (key: string, config: config) {
    if (isDef(key)) {

    } else {
      tip('Wrong set storage')
    }
  }

  _remove (key: string, config: config) {

  }
}

export default new Storages()
