var $LS = window.localStorage;
var $SS = window.sessionStorage;
function isDef(v) {
    return typeof v !== 'undefined' && v !== null;
}
function getObjectType(v) {
    return Object.prototype.toString.call(v).slice(8, -1);
}
function tip(v) {
    if (typeof console !== 'undefined')
        console.warn("[Tip]: " + v);
}
var Storages = /** @class */ (function () {
    function Storages() {
        this.version = 'v4.0.0';
        this.defaults = {
            use: 'local',
            pre: '',
            expire: null,
            once: false
        };
    }
    Storages.prototype.getConfig = function (config) {
        if (config &&
            config.expire &&
            /^[1-9]\d*$/.test(String(config.expire))) {
            config.expire = config.expire + new Date().getTime();
        }
        return Object.assign({}, this.defaults, config);
    };
    Storages.prototype.getKey = function (key, config) {
        return "" + config.pre + key;
    };
    Storages.prototype.getStorage = function (config) {
        return /^(l|local|localStorage)$/.test(String(config.use))
            ? $LS
            : $SS;
    };
    Storages.prototype.getStoreName = function (config) {
        return "__" + config.pre + "_storage_web_version_" + this.version;
    };
    Storages.prototype.set = function (key, value, config) {
        if (isDef(key)) {
            if (Array.isArray(key)) {
                config = this.getConfig(value);
                for (var i in key)
                    this._set(key[i].key, key[i].value, config);
            }
            else {
                config = this.getConfig(config);
                this._set(key, value, config);
            }
        }
        else {
            tip('Wrong set storage');
        }
    };
    Storages.prototype.get = function (key, config) {
        var value;
        config = this.getConfig(config);
        key = this.getKey(key, config);
        if (isDef(key)) {
            var store = this.getStore(key, config);
            value = this.getStorage(config).getItem(key);
            if (store) {
                if (value) {
                    if ((store.expire &&
                        store.expire > new Date().getTime()) ||
                        store.expire === null) {
                        if (config.once)
                            this._remove(key, config);
                        return store.type === 'String'
                            ? value
                            : JSON.parse(value);
                    }
                    else {
                        this._remove(key, config);
                        return null;
                    }
                }
                else {
                    tip('获取 Storage 失败，Storage 中不存在该 key');
                    return null;
                }
            }
            else {
                tip('获取 Storage 异常，未能匹配到参数类型');
                try {
                    return JSON.parse(value);
                }
                catch (_) {
                    return value
                        ? value
                        : null;
                }
            }
        }
        else {
            tip('获取 Storage 失败，key 不能为空');
        }
    };
    Storages.prototype.remove = function (key, config) {
        config = this.getConfig(config);
        if (Array.isArray(key)) {
            for (var i in key) {
                this._remove(key[i], config);
            }
        }
        else {
            this._remove(key, config);
        }
    };
    Storages.prototype.clear = function (config) {
        config = this.getConfig(config);
        if (config.pre) {
            for (var l in $LS) {
                if (l.indexOf(config.pre) === 0)
                    $LS.removeItem(l);
            }
            for (var s in $SS) {
                if (s.indexOf(config.pre) === 0)
                    $SS.removeItem(s);
            }
        }
        else {
            $LS.clear();
            $SS.clear();
        }
    };
    Storages.prototype.store = function (config) {
        var store;
        store = this.getStorage(config).getItem(this.getStoreName(config));
        return store
            ? JSON.parse(store)
            : {};
    };
    Storages.prototype.getStore = function (key, config) {
        var store = this.store(config);
        if (store[key]) {
            return store[key];
        }
        else {
            tip('当前 key 不在 Storage 里面或当前 key 对应的值为 Null');
        }
    };
    Storages.prototype.setStore = function (key, type, config) {
        var store = this.store(config);
        store[key] = {
            type: type,
            expire: this.getConfig(config).expire
        };
        this.getStorage(config).setItem(this.getStoreName(config), JSON.stringify(store));
    };
    Storages.prototype.removeStore = function (key, config) {
        var store = this.store(config);
        delete store[key];
        this.getStorage(config).setItem(this.getStoreName(config), JSON.stringify(store));
    };
    Storages.prototype._set = function (key, value, config) {
        if (isDef(key)) {
            key = this.getKey(key, config);
            var storage = this.getStorage(config);
            if (isDef(value)) {
                var type = getObjectType(value);
                this.setStore(key, type, config);
                if (type === 'String' ||
                    type === 'Number') {
                    storage.setItem(key, value);
                }
                else {
                    storage.setItem(key, JSON.stringify(value));
                }
            }
            else {
                this._remove(key, config);
            }
        }
        else {
            tip('设置 Storage 失败，key 不能为空');
        }
    };
    Storages.prototype._remove = function (key, config) {
        key = this.getKey(key, config);
        this.removeStore(key, config);
        this.getStorage(config).removeItem(key);
    };
    return Storages;
}());
export default new Storages();
//# sourceMappingURL=index.js.map