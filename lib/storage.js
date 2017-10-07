const LS = window.localStorage
const SS = window.sessionStorage

/**
 * 判断是否定义过
 * @param  {*} v
 * @return {Boolean}
 */
function isDef (v) {
  return typeof v !== 'undefined' && v !== null
}

/**
 * 获取 object 类型
 * @param  {*} v
 * @return {String}
 */
function getObjectType (v) {
  return Object.prototype.toString.call(v).slice(8, -1)
}

/**
 * console 提示
 * @param  {String} v
 * @return {Null}
 */
function tip (v) {
  if (typeof console !== 'undefined') console.warn(`[Tip]: ${v}`)
}

function selectStorage (v) {
  return v === 's' || v === 'session' || v === 'SS'
         ? SS
         : LS
}

function Storage (defaults) {
  defaults = defaults || {}
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
  this.$storage = selectStorage(this.defaults.use)
}

/**
 * 是否使用临时属性
 */
Storage.prototype.useTemporary = function (option) {
  return getObjectType(option) === 'Object' && (option.strict || (!option.strict && this.defaults.strict))
}

/**
 * 获取当前 key
 * @param  {Object} option
 */
Storage.prototype.key = function (key, option) {
  return this.useTemporary(option) && getObjectType(option.pre) === 'String'
         ? `${option.pre}${key}`
         : `${this.defaults.pre}${key}`
}

/**
 * 获取当前 storage
 * @param  {Object} option
 */
Storage.prototype.storage = function (option) {
  return this.useTemporary(option) && getObjectType(option.use) === 'String'
         ? selectStorage(this.defaults, option)
         : this.$storage
}

/**
 * 获取当前 pre
 * @param  {Object} option
 */
Storage.prototype.pre = function (option) {
  return this.useTemporary(option) && getObjectType(option.pre) === 'String'
         ? option.pre
         : this.defaults.pre
}

/**
 * 获取 storage 值
 * @param  {String} key
 * @param  {Object} option
 * @return {*}
 */
Storage.prototype.get = function (key, option) {
  if (isDef(key)) {
    key = this.key(key, option)
    let storage = this.storage(option)
    if (this.useTemporary(option)) {
      let value = storage.getItem(key)
      if (value === null) return null
      try {
        value = JSON.parse(value)
        if ((value.expire && value.expire > new Date().getTime()) || value.expire === null) {
          return value.data
        } else {
          storage.removeItem(key)
          return null
        }
      } catch (_) {
        storage.removeItem(key)
        tip('Wrong get storage')
      }
    } else {
      if (this.defaults.strict) {
        let value = storage.getItem(key)
        if (value === null) return null
        try {
          value = JSON.parse(value)
          if ((value.expire && value.expire > new Date().getTime()) || value.expire === null) {
            return value.data
          } else {
            storage.removeItem(key)
            return null
          }
        } catch (_) {
          storage.removeItem(key)
          tip('Wrong get storage')
        }
      } else {
        try {
          return JSON.parse(storage.getItem(key))
        } catch (_) {
          return storage.getItem(key)
        }
      }
    }
  } else {
    tip('Wrong get storage')
  }
}

/**
 * 设置 storage 值
 * @param  {String/Array} key
 * @param  {*} value
 * @param  {Object} option
 */
Storage.prototype.set = function (key, value, option) {
  if (Array.isArray(key)) {
    for (let i in key) this._set(key[i].key, key[i].value, value)
  } else {
    this._set(key, value, option)
  }
}

/**
 * 移除 storage 值
 * @param  {String/Array} key
 */
Storage.prototype.remove = function (key, option) {
  if (Array.isArray(key)) {
    for (let i in key) this._remove(key[i], option)
  } else {
    this._remove(key, option)
  }
}

/**
 * 清除 storage 值
 */
Storage.prototype.clear = function (option) {
  let pre = this.pre(option)
  if (pre) {
    for (let l in LS) {
      if (l.indexOf(pre) === 0) LS.removeItem(l)
    }
    for (let s in SS) {
      if (s.indexOf(pre) === 0) SS.removeItem(s)
    }
  } else {
    SS.clear()
    LS.clear()
  }
}

/**
 * 设置 storage 值
 * @param  {String} key
 * @param  {*} value
 * @param  {Object} option
 */
Storage.prototype._set = function (key, value, option) {
  if (isDef(key)) {
    key = this.key(key, option)
    let storage = this.storage(option)
    if (isDef(value)) {
      if (this.useTemporary(option)) {
        storage.setItem(key, JSON.stringify({
          data: value,
          expire: option.expire || null,
          type: getObjectType(value)
        }))
      } else {
        if (this.defaults.strict) {
          storage.setItem(key, JSON.stringify({
            data: value,
            expire: this.defaults.expire,
            type: getObjectType(value)
          }))
        } else {
          storage.setItem(key, getObjectType(value) === 'String' || getObjectType(value) === 'Number'
                               ? value
                               : JSON.stringify(value))
        }
      }
    } else {
      storage.removeItem(key)
    }
  } else {
    tip('Wrong set storage')
  }
}

/**
 * 移除 storage 值
 * @param  {String} key
 * @param  {Object} option
 */
Storage.prototype._remove = function (key, option) {
  if (key) {
    this.storage(option).removeItem(this.key(key, option))
  } else {
    tip('Wrong remove storage')
  }
}

exports.default = new Storage();
