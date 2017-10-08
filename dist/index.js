'use strict';

var LS = window.localStorage;
var SS = window.sessionStorage;

/**
 * 判断是否定义过
 * @param  {*} v
 * @return {Boolean}
 */
function isDef(v) {
  return typeof v !== 'undefined' && v !== null;
}

/**
 * 获取 object 类型
 * @param  {*} v
 * @return {String}
 */
function getObjectType(v) {
  return Object.prototype.toString.call(v).slice(8, -1);
}

/**
 * console 提示
 * @param  {String} v
 * @return {Null}
 */
function tip(v) {
  if (typeof console !== 'undefined') console.warn('[Tip]: ' + v);
}

function Storages(defaults) {
  defaults = defaults || {};
  if (getObjectType(defaults) === 'String') {
    this.defaults = {
      use: defaults,
      pre: '',
      strict: true,
      expire: null
    };
  } else if (getObjectType(defaults) === 'Object') {
    this.defaults = {
      use: defaults.use,
      pre: getObjectType(defaults.pre) === 'String' ? defaults.pre : '',
      strict: getObjectType(defaults.strict) === 'Boolean' ? defaults.strict : true,
      expire: getObjectType(defaults.expire) === 'Number' ? defaults.expire : null
    };
  } else {
    throw new Error('Wrong storage config');
  }
  this.$storage = /^(s|session|sessionStorage)$/.test(this.defaults.use) ? SS : LS;
}

/**
 * 是否使用临时属性
 */
Storages.prototype.useTemporary = function (config) {
  return getObjectType(config) === 'Object' && (config.strict || !config.strict && this.defaults.strict);
};

/**
 * 获取当前 key
 * @param  {Object} config
 */
Storages.prototype.key = function (key, config) {
  return this.useTemporary(config) && getObjectType(config.pre) === 'String' ? '' + config.pre + key : '' + this.defaults.pre + key;
};

/**
 * 获取当前 storage
 * @param  {Object} config
 */
Storages.prototype.storage = function (config) {
  return this.useTemporary(config) && getObjectType(config.use) === 'String' ? /^(s|session|sessionStorage)$/.test(config.use) ? SS : LS : this.$storage;
};

/**
 * 获取当前 pre
 * @param  {Object} config
 */
Storages.prototype.pre = function (config) {
  return this.useTemporary(config) && getObjectType(config.pre) === 'String' ? config.pre : this.defaults.pre;
};

/**
 * 获取 storage 值
 * @param  {String} key
 * @param  {Object} config
 * @return {*}
 */
Storages.prototype.get = function (key, config) {
  if (isDef(key)) {
    key = this.key(key, config);
    var storage = this.storage(config);
    if (this.useTemporary(config)) {
      var value = storage.getItem(key);
      if (value === null) return null;
      try {
        value = JSON.parse(value);
        if (value.expire && value.expire > new Date().getTime() || value.expire === null) {
          return value.data;
        } else {
          storage.removeItem(key);
          return null;
        }
      } catch (_) {
        storage.removeItem(key);
        tip('Wrong get storage');
      }
    } else {
      if (this.defaults.strict) {
        var _value = storage.getItem(key);
        if (_value === null) return null;
        try {
          _value = JSON.parse(_value);
          if (_value.expire && _value.expire > new Date().getTime() || _value.expire === null) {
            return _value.data;
          } else {
            storage.removeItem(key);
            return null;
          }
        } catch (_) {
          storage.removeItem(key);
          tip('Wrong get storage');
        }
      } else {
        try {
          return JSON.parse(storage.getItem(key));
        } catch (_) {
          return storage.getItem(key);
        }
      }
    }
  } else {
    tip('Wrong get storage');
  }
};

/**
 * 设置 storage 值
 * @param  {String/Array} key
 * @param  {*} value
 * @param  {Object} config
 */
Storages.prototype.set = function (key, value, config) {
  if (Array.isArray(key)) {
    for (var i in key) {
      this._set(key[i].key, key[i].value, value);
    }
  } else {
    this._set(key, value, config);
  }
};

/**
 * 移除 storage 值
 * @param  {String/Array} key
 */
Storages.prototype.remove = function (key, config) {
  if (Array.isArray(key)) {
    for (var i in key) {
      this._remove(key[i], config);
    }
  } else {
    this._remove(key, config);
  }
};

/**
 * 清除 storage 值
 */
Storages.prototype.clear = function (config) {
  var pre = this.pre(config);
  if (pre) {
    for (var l in LS) {
      if (l.indexOf(pre) === 0) LS.removeItem(l);
    }
    for (var s in SS) {
      if (s.indexOf(pre) === 0) SS.removeItem(s);
    }
  } else {
    SS.clear();
    LS.clear();
  }
};

/**
 * 设置 storage 值
 * @param  {String} key
 * @param  {*} value
 * @param  {Object} config
 */
Storages.prototype._set = function (key, value, config) {
  if (isDef(key)) {
    key = this.key(key, config);
    var storage = this.storage(config);
    if (isDef(value)) {
      if (this.useTemporary(config)) {
        storage.setItem(key, JSON.stringify({
          data: value,
          expire: config.expire || null,
          type: getObjectType(value)
        }));
      } else {
        if (this.defaults.strict) {
          storage.setItem(key, JSON.stringify({
            data: value,
            expire: this.defaults.expire,
            type: getObjectType(value)
          }));
        } else {
          storage.setItem(key, getObjectType(value) === 'String' || getObjectType(value) === 'Number' ? value : JSON.stringify(value));
        }
      }
    } else {
      storage.removeItem(key);
    }
  } else {
    tip('Wrong set storage');
  }
};

/**
 * 移除 storage 值
 * @param  {String} key
 * @param  {Object} config
 */
Storages.prototype._remove = function (key, config) {
  if (key) {
    this.storage(config).removeItem(this.key(key, config));
  } else {
    tip('Wrong remove storage');
  }
};

exports.default = new Storages();