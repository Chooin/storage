# storage-web

[![Build Status](https://travis-ci.org/Chooin/storage-web.svg?branch=master)](https://travis-ci.org/Chooin/storage-web)
![JS gzip size](http://img.badgesize.io/https://unpkg.com/storage-web/dist/index.js?compression=gzip&label=gzip%20size:%20JS)
[![npm package](https://img.shields.io/npm/v/storage-web.svg)](https://www.npmjs.org/package/storage-web)

> 对 web 端的 storage 操作，自动解析数据类型，支持 storage 过期时间设置，支持 Vue.js

### 目录

- [对比](#对比)
- [安装](#安装)
- [默认参数](#默认参数)
- [基本使用](#基本使用)
- [在vue中使用](#在vue中使用)
- [get](#get)
- [set](#set)
- [remove](#remove)
- [clear](#clear)

### 对比

``` js
import Storages from 'storage-web'

// 不设置
window.localStorage.getItem('store') // null 😃
Storages.get('store') // null 😃

// 设置 Number
window.localStorage.setItem('store', 1)
window.localStorage.getItem('store') // {String} 😩
Storages.set('store', 1)
Storages.get('store') // {Number} 😃

// 设置 Object
window.localStorage.setItem('store', {})
window.localStorage.getItem('store') // {String} 😩
Storages.set('store', {})
Storages.get('store') // {Object} 😃

// 设置 Array
window.localStorage.setItem('store', [])
window.localStorage.getItem('store') // {String} 😩
Storages.set('store', [])
Storages.get('store') // {Array} 😃

// 设置 Boolean
window.localStorage.setItem('store', false)
window.localStorage.getItem('store') // {String} 😩
Storages.set('store', false)
Storages.get('store') // {Boolean} 😃

// 设置 String
window.localStorage.setItem('store', 'store')
window.localStorage.getItem('store') // {String} 😃
Storages.set('store', 'Tmall')
Storages.get('store') // {String} 😃

// 设置 undefined
window.localStorage.setItem('store', undefined)
window.localStorage.getItem('store') // {String} 😩
Storages.set('store', undefined) // 同等于 Storages.remove('store')
Storages.get('store') // null 😃😃

// 设置 null
window.localStorage.setItem('store', null)
window.localStorage.getItem('store') // {String} 😩
Storages.set('store', null) // 同等于 Storages.remove('store')
Storages.get('store') // null 😃
```

### 安装
``` sh
npm install storage-web --save
# 或
yarn add storage-web
```

### 默认参数

+ {String} use storage 类型，默认：localStorage。值为 `s`/`session`/`sessionStorage` 则使用 sessionStorage，否则使用 localStorage
+ {String} pre 前缀，默认：''。如：当 pre 等于 `pre_` 则 stroage 的 key 会以 `pre_` 开头
+ {Boolean} strict 模式，默认：true。值为 `true` 则设置什么输出什么，如：设置数字 1，获取时也是数字 1
+ {Int} expire 过期时间，默认：null。如：1503170741859，内容过期则无法获取值

### 基本使用

``` js
import Storages from 'storage-web'

Storages.set('store', {}, {
  use: 'session',
  pre: 'pre_',
  strict: true,
  expire: new Date().getTime() + 24 * 60 * 60 * 1000
})
// 或
Storages.set('store', {}, {
  use: 'session'
})
```

### 在vue中使用

``` js
import Storages from 'storage-web'

// 默认使用
Vue.prototype.$storage = Storages

// Vue 中设置默认参数
this.$storage.defaults['use'] = 's'
this.$storage.defaults['pre'] = 'pre_'
this.$storage.defaults['strict'] = true
this.$storage.defaults['expire'] = new Date().getTime() + 24 * 60 * 60 * 1000

// 用 this.$storage 代替 Storages 即可，如：
this.$storage.get('store')
```

## get

获取

``` js
import Storages from 'storage-web'

Storages.get('store') // localStorage

Storages.get('store', { // sessionStorage
  use: 's'
})

Storages.get('store', { // sessionStorage
  use: 'session'
})

Storages.get('store', { // sessionStorage
  use: 'sessionStorage'
})

Storages.get('store', { // sessionStorage name: pre_store
  use: 's',
  pre: 'pre_',
  strict: true
})
```

## set

设置

``` js
import Storages from 'storage-web'

// 支持类型 String,Number,Boolean,Array,Object,Null,Undefined...
let storeValue = {
  store_id: 1,
  store_name: 'Tmall'
}

Storages.set('store', storeValue, {
  use: 's',
  pre: 'pre_',
  strict: true,
  expire: new Date().getTime() + 24 * 60 * 60 * 1000
})

Storages.set([
  {
    key: 'store',
    value: storeValue
  }
], {
  use: 's',
  pre: 'pre_',
  strict: true,
  expire: new Date().getTime() + 24 * 60 * 60 * 1000
})
```

## remove

移除

``` js
import Storages from 'storage-web'

Storages.remove('store')

Storages.remove(['store', 'token'])
```

## clear

清空

``` js
import Storages from 'storage-web'

Storages.clear({ // 清空 localStorage 和 sessionStorage 下所有以 'pre_' 开头的
  pre: 'pre_'
})

Storages.clear() // 清空所有 localStorage 和 sessionStorage
```
