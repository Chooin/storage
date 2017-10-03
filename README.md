# storage-web

[![Build Status](https://travis-ci.org/Chooin/storage-web.svg?branch=master)](https://travis-ci.org/Chooin/storage-web)
![JS gzip size](http://img.badgesize.io/https://unpkg.com/storage-web/dist/storage.js?compression=gzip&label=gzip%20size:%20JS)
[![npm package](https://img.shields.io/npm/v/storage-web.svg)](https://www.npmjs.org/package/storage-web)

> 尽量减少开发对 storage 的类型判断

### stroage-web 对比 localStorage/sessionStorage

``` js
import Storage from 'storage-web'

let storage = new Storage()

window.localStorage.setItem('store', 1)
window.localStorage.setItem('store', '1')
window.localStorage.getItem('store') // 存储的值是一样，了解系统的人才知道要转换成字符串还是数字

storage.set('store', 1)
storage.get('store') // Number
```

### 目录

- [安装](#安装)
- [默认参数](#默认参数)
- [基本使用](#基本使用)
- [Vue.js使用](#Vue.js使用)
- [get](#get)
- [set](#set)
- [remove](#remove)
- [clear](#clear)

### 安装
``` sh
npm install storage-web --save
# 或
yarn add storage-web
```

### 默认参数

``` js
defaults = {
  use: 'local',
  pre: '',
  strict: true,
  expire: null
}
```

参数：

+ {String} use storage 类型，值为 `s`/`session`/`sessionStorage` 则使用 sessionStorage，否则使用 localStorage
+ {String} pre 前缀，如：当 pre 等于 `pre_` 则 stroage 的 key 会以 `pre_` 开头
+ {Boolean} strict 模式，值为 `true` 则设置什么输出什么，如：设置数字 1，获取时也是数字 1
+ {Int} expire 过期时间，如：1503170741859，内容过期则无法获取值

### 基本使用

``` js
import Storage from 'storage-web'

// 参数
defaults = {
  use: 'session',
  pre: 'pre_',
  strict: true,
  expire: new Date().getTime() + 24 * 60 * 60 * 1000
}

new Storage(defaults).set('store', {})

// 或

new Storage('session').set('store', {})
```

### Vue.js使用

``` js
import Storage from 'storage-web'

// 默认使用
Vue.prototype.$storage = new Storage()

// Vue 中设置默认参数
Vue.prototype.$storage = new Storage({
  use: 's',
  pre: 'pre_',
  strict: true,
  expire: new Date().getTime() + 24 * 60 * 60 * 1000
})

// 设置单个参数
this.$storage.defaults.pre = 'pre_'

// 用 this.$storage 代替 new Storage() 即可
```

## get

获取

``` js
import Storage from 'storage-web'

new Storage().get('store') // localStorage

new Storage('s').get('store') // sessionStorage

new Storage('session').get('store') // sessionStorage

new Storage('sessionStorage').get('store') // sessionStorage

new Storage({ // sessionStorage name: pre_store
  use: 's',
  pre: 'pre_',
  strict: true
}).get('store')
```

## set

设置

``` js
import Storage from 'storage-web'

// 支持类型 String,Number,Boolean,Array,Object,Null,Undefined...
let storeValue = {
  store_id: 1,
  store_name: 'Tmall'
}

new Storage({
  use: 's',
  pre: 'pre_',
  strict: true,
  expire: new Date().getTime() + 24 * 60 * 60 * 1000
}).set('store', storeValue)

new Storage().set([
  {
    key: 'store',
    value: storeValue
  }
])
```

## remove

移除

``` js
import Storage from 'storage-web'

new Storage().remove('store')

new Storage().remove(['store', 'token'])
```

## clear

清空

``` js
import Storage from 'storage-web'

new Storage({ pre: 'pre_' }).clear() // 清空 localStorage 和 sessionStorage 下所有以 'pre_' 开头的

new Storage().clear() // 清空所有 localStorage 和 sessionStorage
```
