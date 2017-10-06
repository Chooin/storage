/**
 * Is defined
 * @param  {*} v
 * @return {Boolean}
 */
function isDef(v) {
  return typeof v !== 'undefined' && v !== null
}

/**
 * Get Object type
 * @param  {*} v
 * @return {String}
 */
function getObjectType(v) {
  return Object.prototype.toString.call(v).slice(8, -1);
}

/**
 * Tip
 * @param  {String} v
 * @return {Null}
 */
function tip(v) {
  if (typeof console !== 'undefined') {
    console.warn(`[Tip]: ${v}`)
  }
}

class Storage {
  constructor (defaults = {}) {
    if (getObjectType(defaults) === 'String') {
      this.defaults = {
        use: defaults,
        pre: '',
        strict: true,
        expire: null
      }
    } else if (getObjectType(defaults) === 'Object') {
      this.defaults = {
        use: defaults.use,
        pre: getObjectType(defaults.pre) === 'String' ? defaults.pre : '',
        strict: getObjectType(defaults.strict) === 'Boolean' ? defaults.strict : true,
        expire: getObjectType(defaults.expire) === 'Number' ? defaults.expire : null
      }
    } else {
      throw new Error('Wrong storage option')
    }
    this.$ls = window.localStorage
    this.$ss = window.sessionStorage
    this.$s = this._useStorage(this.defaults.use)
  }

  /**
   * Get storage value
   * @param  {String} key
   * @return {*}
   */
  get (key) {
    if (isDef(key)) {
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
          tip('Wrong get storage')
        }
      } else {
        try {
          return JSON.parse(this.$s.getItem(key))
        } catch (_) {
          return this.$s.getItem(key)
        }
      }
    } else {
      tip('Wrong get storage')
    }
  }

  /**
   * Set storage value
   * @param  {String/Array} key
   * @param  {*} value
   * @param  {Object} option
   */
  set (key, value, option) {
    if (Array.isArray(key)) {
      for (let i in key) {
        this._set(key[i].key, key[i].value, value)
      }
    } else {
      this._set(key, value, option)
    }
  }

  /**
   * Remove storage value
   * @param  {String/Array} key
   */
  remove (key, option) {
    if (Array.isArray(key)) {
      for (let i in key) {
        this._remove(key[i], option)
      }
    } else {
      this._remove(key, option)
    }
  }

  /**
   * Clear storage value
   */
  clear () {
    if (this.defaults.pre) {
      for (let i in this.$ls) {
        if (this.$ls.key(i).indexOf(this.defaults.pre) === 0) this.$ls.removeItem(this.$ls.key(i))
      }
      for (let i in this.$ss) {
        if (this.$ss.key(i).indexOf(this.defaults.pre) === 0) this.$ss.removeItem(this.$ss.key(i))
      }
    } else {
      this.$ss.clear()
      this.$ls.clear()
    }
  }

  _set (key, value, option) {
    if (isDef(key)) {
      const { $t, $s, $key } = this._getOption(key, option)
      if (isDef(value)) {
        if ($t) {
          $s.setItem($key, JSON.stringify({
            data: value,
            expire: option.expire || null,
            type: getObjectType(value)
          }))
        } else {
          if (this.defaults.strict) {
            $s.setItem($key, JSON.stringify({
              data: value,
              expire: this.defaults.expire,
              type: getObjectType(value)
            }))
          } else {
            if (getObjectType(value) === 'String' || getObjectType(value) === 'Number') {
              $s.setItem($key, value)
            } else {
              $s.setItem($key, JSON.stringify(value))
            }
          }
        }
      } else {
        $s.removeItem($key)
      }
    } else {
      tip('Wrong set storage')
    }
  }

  _remove (key, option) {
    if (key) {
      const { $key } = this._getOption(key, option)
      $s.removeItem($key)
    } else {
      tip('Wrong remove storage')
    }
  }

  _useStorage (v) {
    return v === 's' || v === 'session' || v === 'sessionStorage'
           ? this.$ss
           : this.$ls
  }

  _getOption (key, option) {
    // Is temporary attribute
    let $t = getObjectType(option) === 'Object' && (option.strict || (!option.strict && this.defaults.strict))
    // Current storage
    let $s = $t && option.use
             ? this._useStorage(option.use)
             : this.$s
    // Current storage key
    let $key = $t && option.pre
               ? `${option.pre}${key}`
               : `${this.defaults.pre}${key}`
    return {
      $t,
      $s,
      $key
    }
  }
}

export default new Storage()
