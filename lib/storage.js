class Storage {
  constructor (defaults = {}) {
    if (this._type(defaults) === '[object String]') {
      defaults = {
        use: defaults
      }
    } else if (this._type(defaults) === '[object Object]') {
      defaults = {
        use: defaults.use === 's' && defaults.use === 'session' && defaults.use === 'sessionStorage' ? 's' : 'lcoal',
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
              ? window.sessionStorage
              : window.localStorage
  }

  /**
   * Get storage value
   * @param  {String} key
   * @return {*}
   */
  get (key) {
    if (key) {
      key = `${this.defaults.pre}${key}`
      if (this.defaults.strict) {
        let value = this.$s.getItem(key)
        if (value) {
          value = JSON.parse(value)
          if ((value.expire && value.expire > new Date().getTime()) || value.expire === null) {
            return value.data
          } else {
            this.$s.removeItem(key)
          }
        }
        return null
      } else {
        try {
          return JSON.parse(this.$s.getItem(key))
        } catch (_) {
          return this.$s.getItem(key)
        }
      }
    } else {
      console.warn('Wrong get storage')
    }
  }

  /**
   * Set storage value
   * @param  {String/Array} key
   * @param  {*} value
   */
  set (key, value) {
    if (this._type(key) === '[object Array]') {
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
    if (this._type(key) === '[object Array]') {
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
    if (key) {
      key = `${this.defaults.pre}${key}`
      if (this._type(value) === '[object Undefined]' || this._type(value) === '[object Null]') {
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
    } else {
      console.warn('Wrong set storage')
    }
  }

  _remove (key) {
    if (key) {
      this.$s.removeItem(`${this.defaults.pre}${key}`)
    } else {
      console.warn('Wrong remove storage')
    }
  }

  _type (value) {
    return Object.prototype.toString.call(value)
  }
}

export default Storage
