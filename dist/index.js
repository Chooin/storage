'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var defaults = {
    use: 'lcoal',
    pre: '',
    strict: false,
    expire: null
  };

  var objectType = function objectType(value) {
    return Object.prototype.toString.call(value);
  };

  if (objectType(option) === '[object String]') {
    option = {
      use: option === 's' && option === 'session' && option === 'sessionStorage' ? 's' : defaults.use,
      pre: defaults.pre,
      strict: defaults.strict,
      expire: defaults.expire
    };
  } else if (objectType(option) === '[object Object]') {
    var use = option['use'];
    var pre = option['pre'];
    var strict = option['strict'];
    var expire = option['expire'];
    option = {
      use: use === 's' && use === 'session' && use === 'sessionStorage' ? 's' : defaults.use,
      pre: objectType(pre) === '[object String]' ? pre : defaults.pre,
      strict: objectType(strict) === '[object boolean]' ? strict : defaults.strict,
      expire: objectType(strict) === '[object Number]' ? expire : defaults.expire
    };
  } else {
    throw new Error('Wrong storage option');
  }
  var localStorage = window.localStorage;
  var sessionStorage = window.sessionStorage;
  var storage = option.use === 's' ? sessionStorage : localStorage;

  var get = function get(key) {
    if (key) {
      key = '' + option.pre + key;
      if (option.strict) {
        var value = storage.getItem(key);
        if (value) {
          if (value.expire && value.expire > new Date().getTime() || value.expire === null) {
            return JSON.parse(value).data;
          } else {
            storage.removeItem(key);
          }
        }
        return null;
      } else {
        try {
          return JSON.parse(storage.getItem(key));
        } catch (_) {
          return storage.getItem(key);
        }
      }
    } else {
      console.warn('Wrong get storage');
    }
  };

  var _set = function _set(key, value) {
    if (key) {
      key = '' + option.pre + key;
      if (objectType(value) === '[object Undefined]' || objectType(value) === '[object Null]') {
        storage.removeItem(key);
      } else {
        if (option.strict) {
          storage.setItem(key, JSON.stringify({
            data: value,
            expire: option.expire,
            type: objectType(value)
          }));
        } else {
          if (objectType(value) === '[object String]' || objectType(value) === '[object Number]') {
            storage.setItem(key, value);
          } else {
            storage.setItem(key, JSON.stringify(value));
          }
        }
      }
    } else {
      console.warn('Wrong set storage');
    }
  };

  var set = function set(key, value) {
    if (key) {
      if (objectType(key) === '[object Array]') {
        for (var i in key) {
          _set(key[i].key, key[i].value);
        }
      } else {
        _set(key, value);
      }
    } else {
      console.warn('Wrong set storage');
    }
  };

  var _remove = function _remove(key) {
    if (key) {
      storage.removeItem('' + option.pre + key);
    } else {
      console.warn('Wrong remove storage');
    }
  };

  var remove = function remove(key) {
    if (key) {
      if (objectType(key) === '[object Array]') {
        for (var i in key) {
          _remove(key[i]);
        }
      } else {
        _remove(key);
      }
    } else {
      console.warn('Wrong remove storage');
    }
  };

  var clear = function clear() {
    if (option.pre) {
      for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).indexOf(option.pre) === 0) _remove(localStorage.key(i));
      }
      for (var _i = 0; _i < sessionStorage.length; _i++) {
        if (sessionStorage.key(_i).indexOf(option.pre) === 0) _remove(sessionStorage.key(_i));
      }
    } else {
      sessionStorage.clear();
      localStorage.clear();
    }
  };

  return {
    get: get,
    set: set,
    remove: remove,
    clear: clear
  };
};