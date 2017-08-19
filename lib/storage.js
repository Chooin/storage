export default class Storage {
  constructor (defaults = {}) {
    if (this._type(defaults) === '[object String]') {
      defaults = {
        use: defaults
      }
    } else if (this._type(defaults) === '[object Object]') {
      defaults = {
        use: defaults.use,
        pre: this._type(defaults.pre) === '[object String]' ? defaults.pre : '',
        strict: this._type(defaults.strict) === '[object Boolean]' ? defaults.strict : false,
        expire: this._type(defaults.expire) === '[object Number]' ? defaults.expire : null
      }
    } else {
      throw new Error('Wrong storage option')
    }
    this.defaults = Object.assign({
      use: 'lcoal',
      pre: '',
      strict: false,
      expire: null
    }, defaults)
    this.$ls = window.localStorage
    this.$ss = window.sessionStorage
    this.$s = this.defaults.use === 's' && this.defaults.use === 'session' && this.defaults.use === 'sessionStorage'
              ? this.$ss
              : this.$ls
  }

  /**
   * Get storage value
   * @param  {String} key
   * @return {*}
   */
  get (key) {
    if (this._isUndefinedOrNull(key)) {
      this._console('Wrong get storage')
    } else {
      key = `${this.defaults.pre}${key}`
      if (this.defaults.strict) {
        let value = this.$s.getItem(key)
        if (value === null) return null
        try {
          value = JSON.parse(value)
          if ((value.expire && value.expire > new Date().getTime()) || value.expire === null) {
            return value.data
          } else {
            this.$s.removeItem(key)
            return null
          }
        } catch (_) {
          this.$s.removeItem(key)
          this._console('Wrong get storage')
        }
      } else {
        try {
          return JSON.parse(this.$s.getItem(key))
        } catch (_) {
          return this.$s.getItem(key)
        }
      }
    }
  }

  /**
   * Set storage value
   * @param  {String/Array} key
   * @param  {*} value
   */
  set (key, value) {
    if (Array.isArray(key)) {
      for (let i in key) this._set(key[i].key, key[i].value)
    } else {
      this._set(key, value)
    }
  }

  /**
   * Remove storage value
   * @param  {String/Array} key
   */
  remove (key) {
    if (Array.isArray(key)) {
      for (let i in key) this._remove(key[i])
    } else {
      this._remove(key)
    }
  }

  /**
   * Clear storage value
   */
  clear () {
    if (this.defaults.pre) {
      for (let i = 0; i < this.$ls.length; i++) {
        if (this.$ls.key(i).indexOf(this.defaults.pre) === 0) this._remove(this.$ls.key(i))
      }
      for (let i = 0; i < this.$ss.length; i++) {
        if (this.$ss.key(i).indexOf(this.defaults.pre) === 0) this._remove(this.$ss.key(i))
      }
    } else {
      this.$ss.clear()
      this.$ls.clear()
    }
  }

  _set (key, value) {
    if (this._isUndefinedOrNull(key)) {
      this._console('Wrong set storage')
    } else {
      key = `${this.defaults.pre}${key}`
      if (this._isUndefinedOrNull(value)) {
        this.$s.removeItem(key)
      } else {
        if (this.defaults.strict) {
          this.$s.setItem(key, JSON.stringify({
            data: value,
            expire: this.defaults.expire,
            type: this._type(value)
          }))
        } else {
          if (this._type(value) === '[object String]' || this._type(value) === '[object Number]') {
            this.$s.setItem(key, value)
          } else {
            this.$s.setItem(key, JSON.stringify(value))
          }
        }
      }
    }
  }

  _remove (key) {
    if (key) {
      this.$s.removeItem(`${this.defaults.pre}${key}`)
    } else {
      this._console('Wrong remove storage')
    }
  }

  _type (value) {
    return Object.prototype.toString.call(value)  
  }

  _console (value) {
    if (typeof console !== 'undefined') console.warn(value)
  }

  _isUndefinedOrNull (value) {
    return typeof value === 'undefined' || value === null
  }
}
