# storage-web

### window.localStorage/window.sessionStorage 对比 stroage-web

``` js
import Storage from 'storage-web'

// String 处理

window.localStorage.setItem('value', 'string')
JSON.parse(window.localStorage.getItem('value')) // string

new Storage().set('value', 'string')
new Storage().get('value') // string

//------------------------------------------------------------------------

// Number 处理

window.localStorage.setItem('value', 1)
JSON.parse(window.localStorage.getItem('value')) // number

new Storage().set('value', 1)
new Storage().get('value') // number

//------------------------------------------------------------------------

// Array

window.localStorage.setItem('value', [1, 2, 3])
JSON.parse(window.localStorage.getItem('value')) // array

new Storage().set('value', [1, 2, 3])
new Storage().get('value') // array

//------------------------------------------------------------------------

// Object

window.localStorage.setItem('store', JSON.stringify({ store_name: 'Tmall' }))
JSON.parse(window.localStorage.getItem('store')) // object

new Storage().set('value', { store_name: 'Tmall' })
new Storage().get('value') // object

//------------------------------------------------------------------------

// Null

window.localStorage.setItem('value', null) // 设置 storage 的值为 'null'
JSON.parse(window.localStorage.getItem('value')) // 返回 null

new Storage().set('value', null) // 清空 storage 中的 value 值
new Storage().get('value') // null

// ------------------------------------------------------------------------

// Undefined

window.localStorage.setItem('value', undefined) // 设置 storage 的值为 'undefined'
JSON.parse(window.localStorage.getItem('value')) // 返回 'undefined'

new Storage().set('value', undefined) // 清空 storage 中的 value 值
new Storage().get('value') // 返回 null
```

### 安装
``` sh
npm install storage-web --save
# 或
yarn add storage-web
```

### 默认参数

``` js
defaults = {
  use: 'local', // String 使用 localStorage
  pre: '', // String 无前缀（storage的前缀，如：pre_store）
  strict: false, // Boolean 关闭严格模式（严格模式，设置什么输出什么）
  expire: null // Int 无过期时间
}
```

参数描述：

1. use 等于 `s`/`session`/`sessionStorage`，则使用 sessionStorage，否则使用 localStorage
2. pre 前缀，如：当 pre 等于 `pre_` 则 stroage 的 key 会以 `pre_` 开头
3. strict 严格模式，设置什么输出什么，如：设置 int 型数字，则输出 int 型数字
4. expire 过期时间，如：1503170741859，内容过期会将它从 storage 里面移除

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



### Vue.js 使用

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
