'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Is defined
 * @param  {*} v
 * @return {Boolean}
 */
function isDef(v) {
  return typeof v !== 'undefined' && v !== null;
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
    console.warn('[Tip]: ' + v);
  }
}

var Storage = function () {
  function Storage() {
    var defaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Storage);

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
      throw new Error('Wrong storage option');
    }
    this.$ls = window.localStorage;
    this.$ss = window.sessionStorage;
    this.$s = this._useStorage(this.defaults.use);
  }

  /**
   * Get storage value
   * @param  {String} key
   * @return {*}
   */


  _createClass(Storage, [{
    key: 'get',
    value: function get(key) {
      if (isDef(key)) {
        key = '' + this.defaults.pre + key;
        if (this.defaults.strict) {
          var value = this.$s.getItem(key);
          if (value === null) return null;
          try {
            value = JSON.parse(value);
            if (value.expire && value.expire > new Date().getTime() || value.expire === null) {
              return value.data;
            } else {
              this.$s.removeItem(key);
              return null;
            }
          } catch (_) {
            this.$s.removeItem(key);
            tip('Wrong get storage');
          }
        } else {
          try {
            return JSON.parse(this.$s.getItem(key));
          } catch (_) {
            return this.$s.getItem(key);
          }
        }
      } else {
        tip('Wrong get storage');
      }
    }

    /**
     * Set storage value
     * @param  {String/Array} key
     * @param  {*} value
     * @param  {Object} option
     */

  }, {
    key: 'set',
    value: function set(key, value, option) {
      if (Array.isArray(key)) {
        for (var i in key) {
          this._set(key[i].key, key[i].value, value);
        }
      } else {
        this._set(key, value, option);
      }
    }

    /**
     * Remove storage value
     * @param  {String/Array} key
     */

  }, {
    key: 'remove',
    value: function remove(key, option) {
      if (Array.isArray(key)) {
        for (var i in key) {
          this._remove(key[i], option);
        }
      } else {
        this._remove(key, option);
      }
    }

    /**
     * Clear storage value
     */

  }, {
    key: 'clear',
    value: function clear() {
      if (this.defaults.pre) {
        for (var i in this.$ls) {
          if (this.$ls.key(i).indexOf(this.defaults.pre) === 0) this.$ls.removeItem(this.$ls.key(i));
        }
        for (var _i in this.$ss) {
          if (this.$ss.key(_i).indexOf(this.defaults.pre) === 0) this.$ss.removeItem(this.$ss.key(_i));
        }
      } else {
        this.$ss.clear();
        this.$ls.clear();
      }
    }
  }, {
    key: '_set',
    value: function _set(key, value, option) {
      if (isDef(key)) {
        var _getOption2 = this._getOption(key, option),
            $t = _getOption2.$t,
            _$s = _getOption2.$s,
            $key = _getOption2.$key;

        if (isDef(value)) {
          if ($t) {
            _$s.setItem($key, JSON.stringify({
              data: value,
              expire: option.expire || null,
              type: getObjectType(value)
            }));
          } else {
            if (this.defaults.strict) {
              _$s.setItem($key, JSON.stringify({
                data: value,
                expire: this.defaults.expire,
                type: getObjectType(value)
              }));
            } else {
              if (getObjectType(value) === 'String' || getObjectType(value) === 'Number') {
                _$s.setItem($key, value);
              } else {
                _$s.setItem($key, JSON.stringify(value));
              }
            }
          }
        } else {
          _$s.removeItem($key);
        }
      } else {
        tip('Wrong set storage');
      }
    }
  }, {
    key: '_remove',
    value: function _remove(key, option) {
      if (key) {
        var _getOption3 = this._getOption(key, option),
            $key = _getOption3.$key;

        $s.removeItem($key);
      } else {
        tip('Wrong remove storage');
      }
    }
  }, {
    key: '_useStorage',
    value: function _useStorage(v) {
      return v === 's' || v === 'session' || v === 'sessionStorage' ? this.$ss : this.$ls;
    }
  }, {
    key: '_getOption',
    value: function _getOption(key, option) {
      // Is temporary attribute
      var $t = getObjectType(option) === 'Object' && (option.strict || !option.strict && this.defaults.strict);
      // Current storage
      var $s = $t && option.use ? this._useStorage(option.use) : this.$s;
      // Current storage key
      var $key = $t && option.pre ? '' + option.pre + key : '' + this.defaults.pre + key;
      return {
        $t: $t,
        $s: $s,
        $key: $key
      };
    }
  }]);

  return Storage;
}();

exports.default = new Storage();