(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/storage.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/storage.ts":
/*!************************!*\
  !*** ./lib/storage.ts ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
            expire: null
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
        config = this.getConfig(config);
        var value;
        key = this.getKey(key, config);
        if (isDef(key)) {
            var store = this.getStore(key, config);
            value = this.getStorage(config).getItem(key);
            if (store) {
                if (value) {
                    if ((store.expire &&
                        store.expire > new Date().getTime()) ||
                        store.expire === null) {
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
/* harmony default export */ __webpack_exports__["default"] = (new Storages());


/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9saWIvc3RvcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNuRUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHdpbmRvdywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vbGliL3N0b3JhZ2UudHNcIik7XG4iLCJ2YXIgJExTID0gd2luZG93LmxvY2FsU3RvcmFnZTtcbnZhciAkU1MgPSB3aW5kb3cuc2Vzc2lvblN0b3JhZ2U7XG5mdW5jdGlvbiBpc0RlZih2KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2ICE9PSAndW5kZWZpbmVkJyAmJiB2ICE9PSBudWxsO1xufVxuZnVuY3Rpb24gZ2V0T2JqZWN0VHlwZSh2KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2KS5zbGljZSg4LCAtMSk7XG59XG5mdW5jdGlvbiB0aXAodikge1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIGNvbnNvbGUud2FybihcIltUaXBdOiBcIiArIHYpO1xufVxudmFyIFN0b3JhZ2VzID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN0b3JhZ2VzKCkge1xuICAgICAgICB0aGlzLnZlcnNpb24gPSAndjQuMC4wJztcbiAgICAgICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIHVzZTogJ2xvY2FsJyxcbiAgICAgICAgICAgIHByZTogJycsXG4gICAgICAgICAgICBleHBpcmU6IG51bGxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgU3RvcmFnZXMucHJvdG90eXBlLmdldENvbmZpZyA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZyAmJlxuICAgICAgICAgICAgY29uZmlnLmV4cGlyZSAmJlxuICAgICAgICAgICAgL15bMS05XVxcZCokLy50ZXN0KFN0cmluZyhjb25maWcuZXhwaXJlKSkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5leHBpcmUgPSBjb25maWcuZXhwaXJlICsgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gICAgfTtcbiAgICBTdG9yYWdlcy5wcm90b3R5cGUuZ2V0S2V5ID0gZnVuY3Rpb24gKGtleSwgY29uZmlnKSB7XG4gICAgICAgIHJldHVybiBcIlwiICsgY29uZmlnLnByZSArIGtleTtcbiAgICB9O1xuICAgIFN0b3JhZ2VzLnByb3RvdHlwZS5nZXRTdG9yYWdlID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICByZXR1cm4gL14obHxsb2NhbHxsb2NhbFN0b3JhZ2UpJC8udGVzdChTdHJpbmcoY29uZmlnLnVzZSkpXG4gICAgICAgICAgICA/ICRMU1xuICAgICAgICAgICAgOiAkU1M7XG4gICAgfTtcbiAgICBTdG9yYWdlcy5wcm90b3R5cGUuZ2V0U3RvcmVOYW1lID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICByZXR1cm4gXCJfX1wiICsgY29uZmlnLnByZSArIFwiX3N0b3JhZ2Vfd2ViX3ZlcnNpb25fXCIgKyB0aGlzLnZlcnNpb247XG4gICAgfTtcbiAgICBTdG9yYWdlcy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIGNvbmZpZykge1xuICAgICAgICBpZiAoaXNEZWYoa2V5KSkge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZyA9IHRoaXMuZ2V0Q29uZmlnKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGtleSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0KGtleVtpXS5rZXksIGtleVtpXS52YWx1ZSwgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbmZpZyA9IHRoaXMuZ2V0Q29uZmlnKGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0KGtleSwgdmFsdWUsIGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aXAoJ1dyb25nIHNldCBzdG9yYWdlJyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN0b3JhZ2VzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnID0gdGhpcy5nZXRDb25maWcoY29uZmlnKTtcbiAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICBrZXkgPSB0aGlzLmdldEtleShrZXksIGNvbmZpZyk7XG4gICAgICAgIGlmIChpc0RlZihrZXkpKSB7XG4gICAgICAgICAgICB2YXIgc3RvcmUgPSB0aGlzLmdldFN0b3JlKGtleSwgY29uZmlnKTtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5nZXRTdG9yYWdlKGNvbmZpZykuZ2V0SXRlbShrZXkpO1xuICAgICAgICAgICAgaWYgKHN0b3JlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoc3RvcmUuZXhwaXJlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5leHBpcmUgPiBuZXcgRGF0ZSgpLmdldFRpbWUoKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLmV4cGlyZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLnR5cGUgPT09ICdTdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmUoa2V5LCBjb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRpcCgn6I635Y+WIFN0b3JhZ2Ug5aSx6LSl77yMU3RvcmFnZSDkuK3kuI3lrZjlnKjor6Uga2V5Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRpcCgn6I635Y+WIFN0b3JhZ2Ug5byC5bi477yM5pyq6IO95Yy56YWN5Yiw5Y+C5pWw57G75Z6LJyk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoXykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aXAoJ+iOt+WPliBTdG9yYWdlIOWksei0pe+8jGtleSDkuI3og73kuLrnqbonKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3RvcmFnZXMucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcgPSB0aGlzLmdldENvbmZpZyhjb25maWcpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGtleSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZShrZXlbaV0sIGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9yZW1vdmUoa2V5LCBjb25maWcpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdG9yYWdlcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZyA9IHRoaXMuZ2V0Q29uZmlnKGNvbmZpZyk7XG4gICAgICAgIGlmIChjb25maWcucHJlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBsIGluICRMUykge1xuICAgICAgICAgICAgICAgIGlmIChsLmluZGV4T2YoY29uZmlnLnByZSkgPT09IDApXG4gICAgICAgICAgICAgICAgICAgICRMUy5yZW1vdmVJdGVtKGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgcyBpbiAkU1MpIHtcbiAgICAgICAgICAgICAgICBpZiAocy5pbmRleE9mKGNvbmZpZy5wcmUpID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAkU1MucmVtb3ZlSXRlbShzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICRMUy5jbGVhcigpO1xuICAgICAgICAgICAgJFNTLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN0b3JhZ2VzLnByb3RvdHlwZS5zdG9yZSA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgdmFyIHN0b3JlO1xuICAgICAgICBzdG9yZSA9IHRoaXMuZ2V0U3RvcmFnZShjb25maWcpLmdldEl0ZW0odGhpcy5nZXRTdG9yZU5hbWUoY29uZmlnKSk7XG4gICAgICAgIHJldHVybiBzdG9yZVxuICAgICAgICAgICAgPyBKU09OLnBhcnNlKHN0b3JlKVxuICAgICAgICAgICAgOiB7fTtcbiAgICB9O1xuICAgIFN0b3JhZ2VzLnByb3RvdHlwZS5nZXRTdG9yZSA9IGZ1bmN0aW9uIChrZXksIGNvbmZpZykge1xuICAgICAgICB2YXIgc3RvcmUgPSB0aGlzLnN0b3JlKGNvbmZpZyk7XG4gICAgICAgIGlmIChzdG9yZVtrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmVba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRpcCgn5b2T5YmNIGtleSDkuI3lnKggU3RvcmFnZSDph4zpnaLmiJblvZPliY0ga2V5IOWvueW6lOeahOWAvOS4uiBOdWxsJyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN0b3JhZ2VzLnByb3RvdHlwZS5zZXRTdG9yZSA9IGZ1bmN0aW9uIChrZXksIHR5cGUsIGNvbmZpZykge1xuICAgICAgICB2YXIgc3RvcmUgPSB0aGlzLnN0b3JlKGNvbmZpZyk7XG4gICAgICAgIHN0b3JlW2tleV0gPSB7XG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgZXhwaXJlOiB0aGlzLmdldENvbmZpZyhjb25maWcpLmV4cGlyZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldFN0b3JhZ2UoY29uZmlnKS5zZXRJdGVtKHRoaXMuZ2V0U3RvcmVOYW1lKGNvbmZpZyksIEpTT04uc3RyaW5naWZ5KHN0b3JlKSk7XG4gICAgfTtcbiAgICBTdG9yYWdlcy5wcm90b3R5cGUucmVtb3ZlU3RvcmUgPSBmdW5jdGlvbiAoa2V5LCBjb25maWcpIHtcbiAgICAgICAgdmFyIHN0b3JlID0gdGhpcy5zdG9yZShjb25maWcpO1xuICAgICAgICBkZWxldGUgc3RvcmVba2V5XTtcbiAgICAgICAgdGhpcy5nZXRTdG9yYWdlKGNvbmZpZykuc2V0SXRlbSh0aGlzLmdldFN0b3JlTmFtZShjb25maWcpLCBKU09OLnN0cmluZ2lmeShzdG9yZSkpO1xuICAgIH07XG4gICAgU3RvcmFnZXMucHJvdG90eXBlLl9zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgY29uZmlnKSB7XG4gICAgICAgIGlmIChpc0RlZihrZXkpKSB7XG4gICAgICAgICAgICBrZXkgPSB0aGlzLmdldEtleShrZXksIGNvbmZpZyk7XG4gICAgICAgICAgICB2YXIgc3RvcmFnZSA9IHRoaXMuZ2V0U3RvcmFnZShjb25maWcpO1xuICAgICAgICAgICAgaWYgKGlzRGVmKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gZ2V0T2JqZWN0VHlwZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdG9yZShrZXksIHR5cGUsIGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdTdHJpbmcnIHx8XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPT09ICdOdW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlKGtleSwgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRpcCgn6K6+572uIFN0b3JhZ2Ug5aSx6LSl77yMa2V5IOS4jeiDveS4uuepuicpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdG9yYWdlcy5wcm90b3R5cGUuX3JlbW92ZSA9IGZ1bmN0aW9uIChrZXksIGNvbmZpZykge1xuICAgICAgICBrZXkgPSB0aGlzLmdldEtleShrZXksIGNvbmZpZyk7XG4gICAgICAgIHRoaXMucmVtb3ZlU3RvcmUoa2V5LCBjb25maWcpO1xuICAgICAgICB0aGlzLmdldFN0b3JhZ2UoY29uZmlnKS5yZW1vdmVJdGVtKGtleSk7XG4gICAgfTtcbiAgICByZXR1cm4gU3RvcmFnZXM7XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgbmV3IFN0b3JhZ2VzKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9