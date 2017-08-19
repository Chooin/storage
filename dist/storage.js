'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Storage = function () {
  function Storage() {
    var defaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Storage);

    if (this._type(defaults) === '[object String]') {
      defaults = {
        use: defaults
      };
    } else if (this._type(defaults) === '[object Object]') {
      defaults = {
        use: defaults.use,
        pre: this._type(defaults.pre) === '[object String]' ? defaults.pre : '',
        strict: this._type(defaults.strict) === '[object Boolean]' ? defaults.strict : false,
        expire: this._type(defaults.expire) === '[object Number]' ? defaults.expire : null
      };
    } else {
      throw new Error('Wrong storage option');
    }
    this.defaults = Object.assign({
      use: 'lcoal',
      pre: '',
      strict: false,
      expire: null
    }, defaults);
    this.$ls = window.localStorage;
    this.$ss = window.sessionStorage;
    this.$s = this.defaults.use === 's' && this.defaults.use === 'session' && this.defaults.use === 'sessionStorage' ? this.$ss : this.$ls;
  }

  /**
   * Get storage value
   * @param  {String} key
   * @return {*}
   */


  _createClass(Storage, [{
    key: 'get',
    value: function get(key) {
      if (key) {
        key = '' + this.defaults.pre + key;
        if (this.defaults.strict) {
          var value = this.$s.getItem(key);
          if (value === null) return null;
          try {
            value = JSON.parse(value);
          } catch (_) {
            return null;
          }
          if (value.expire && value.expire > new Date().getTime() || value.expire === null) {
            return value.data;
          } else {
            this.$s.removeItem(key);
          }
        } else {
          try {
            return JSON.parse(this.$s.getItem(key));
          } catch (_) {
            return this.$s.getItem(key);
          }
        }
      } else {
        this._console('Wrong get storage');
      }
    }

    /**
     * Set storage value
     * @param  {String/Array} key
     * @param  {*} value
     */

  }, {
    key: 'set',
    value: function set(key, value) {
      if (Array.isArray(key)) {
        for (var i in key) {
          this._set(key[i].key, key[i].value);
        }
      } else {
        this._set(key, value);
      }
    }

    /**
     * Remove storage value
     * @param  {String/Array} key
     */

  }, {
    key: 'remove',
    value: function remove(key) {
      if (Array.isArray(key)) {
        for (var i in key) {
          this._remove(key[i]);
        }
      } else {
        this._remove(key);
      }
    }

    /**
     * Clear storage value
     */

  }, {
    key: 'clear',
    value: function clear() {
      if (this.defaults.pre) {
        for (var i = 0; i < this.$ls.length; i++) {
          if (this.$ls.key(i).indexOf(this.defaults.pre) === 0) this._remove(this.$ls.key(i));
        }
        for (var _i = 0; _i < this.$ss.length; _i++) {
          if (this.$ss.key(_i).indexOf(this.defaults.pre) === 0) this._remove(this.$ss.key(_i));
        }
      } else {
        this.$ss.clear();
        this.$ls.clear();
      }
    }
  }, {
    key: '_set',
    value: function _set(key, value) {
      if (key) {
        key = '' + this.defaults.pre + key;
        if (typeof value === 'undefined' || value === null) {
          this.$s.removeItem(key);
        } else {
          if (this.defaults.strict) {
            this.$s.setItem(key, JSON.stringify({
              data: value,
              expire: this.defaults.expire,
              type: this._type(value)
            }));
          } else {
            if (this._type(value) === '[object String]' || this._type(value) === '[object Number]') {
              this.$s.setItem(key, value);
            } else {
              this.$s.setItem(key, JSON.stringify(value));
            }
          }
        }
      } else {
        this._console('Wrong set storage');
      }
    }
  }, {
    key: '_remove',
    value: function _remove(key) {
      if (key) {
        this.$s.removeItem('' + this.defaults.pre + key);
      } else {
        this._console('Wrong remove storage');
      }
    }
  }, {
    key: '_type',
    value: function _type(value) {
      return Object.prototype.toString.call(value);
    }
  }, {
    key: '_console',
    value: function _console(value) {
      if (typeof console !== 'undefined') console.warn(value);
    }
  }]);

  return Storage;
}();

exports.default = Storage;