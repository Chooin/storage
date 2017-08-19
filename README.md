# storage-web

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
  pre: '', // String 无命名空间（命名空间）
  strict: false, // Boolean 关闭严格模式（严格模式，设置什么输出什么）
  expire: null // Int 无过期时间
}
```

参数描述：

1. use 等于 `s`/`session`/`sessionStorage`，则使用 sessionStorage，否则使用 localStorage
2. pre 命名空间，如：当 pre 等于 `pre_` 则 stroage 的 key 会以 `pre_` 开头
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

new Storage({ // sessionStorage name: my_store
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

可以清空当前作用域下的 storage

``` js
import Storage from 'storage-web'

new Storage({ pre: 'pre_' }).clear() // 清空 localStorage 和 sessionStorage 下所有以 'my_' 开头的

new Storage().clear() // 清空所有 localStorage 和 sessionStorage
```
