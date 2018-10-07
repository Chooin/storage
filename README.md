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
- [getOnce](#getOnce)
- [set](#set)
- [remove](#remove)
- [clear](#clear)

### 对比

设置参数类型 | localStorage.getItem 获取到的类型 | storage-web 获取到的类型
--------- | -------- | --------
无 | 😃 Null | 😃 Null
Number | 😰 String | 😃 Number
String | 😃 String | 😃 String
Object | 😰 String | 😃 Object
Array | 😰 String | 😃 Array
Boolean | 😰 String | 😃 Boolean
Undefined | 😰 String | 🤩 Null
Null | 😰 String | 😃 Null

### 安装
``` sh
yarn add storage-web
```

### 默认参数

参数 | 说明 | 类型 | 可选值 | 默认值
--------- | -------- | -------- | -------- | --------
use | 使用的 storage 类型 | String | l/local/localStorage/s/session/sessionStorage | local
pre | 前缀 | String | - | -
expire| 过期时间，从当前开始 | Number | - | -

### 基本使用

``` js
import storages from 'storage-web'

storages.set('store', {}, {
  use: 'session',
  pre: 'pre_',
  expire: 24 * 60 * 60 * 1000
})
// 或
storages.set('store', {}, {
  use: 'session'
})
```

### 在vue中使用

``` js
import storages from 'storage-web'

// 挂载到原型链上
Vue.prototype.$storage = storages

// Vue 中设置默认参数
this.$storage.defaults['use'] = 'local'
this.$storage.defaults['pre'] = 'pre_'
this.$storage.defaults['expire'] = 24 * 60 * 60 * 1000

// 用 this.$storage 代替 storages 即可，如：
this.$storage.get('store')
```

## get

获取

``` js
import storages from 'storage-web'

storages.get('store') // localStorage

storages.get('store', { // sessionStorage
  use: 's'
})

storages.get('store', { // sessionStorage
  use: 'session'
})

storages.get('store', { // sessionStorage
  use: 'sessionStorage'
})

storages.get('store', { // sessionStorage name: pre_store
  use: 's',
  pre: 'pre_'
})
```

## getOnce

获取即销毁

```js
storages.getOnce('store') // 获取即销毁
```

## set

设置

``` js
import storages from 'storage-web'

// 支持类型 String,Number,Boolean,Array,Object,Null,Undefined...
let storeValue = {
  store_id: 1,
  store_name: 'Tmall'
}

storages.set('store', storeValue, {
  use: 's',
  pre: 'pre_',
  expire: 24 * 60 * 60 * 1000
})

storages.set([
  {
    key: 'store',
    value: storeValue
  }
], {
  use: 's',
  pre: 'pre_',
  expire: 24 * 60 * 60 * 1000
})
```

## remove

移除

``` js
import storages from 'storage-web'

storages.remove('store')

storages.remove(['store', 'token'])
```

## clear

清空

``` js
import storages from 'storage-web'

storages.clear({ // 清空 localStorage 和 sessionStorage 下所有以 'pre_' 开头的
  pre: 'pre_'
})

storages.clear() // 清空所有 localStorage 和 sessionStorage
```


