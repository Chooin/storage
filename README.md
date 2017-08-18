# Storage

### get localStorage

get

获取

``` js
storage().get('store') // localStorage
storage('local').get('store')  // localStorage
storage('s').get('store') // sessionStorage
storage('session').get('store') // sessionStorage
storage('sessionStorage').get('store') // sessionStorage
storage('local', { pre: 'my_' }).get('store')  // localStorage name: my_store
```

set

设置

``` js
// 支持类型 String,Number,Boolean,Array,Object,Null,Undefined
let storeValue = {
  store_id: 1,
  store_name: '真功夫'
}

storage().set('store', storeValue)
// 或
storage().set([
  {
    key: 'store',
    value: storeValue
  }
])
```

remove

移除

``` js
storage().remove('store')
// 或
storage().remove(['store', 'token'])
```

clear

可以清空当前作用域下的 storage

``` js
storage('local', { pre: 'my_' }).clear() // 清空 localStorage 下所有以 'my_' 开头的
storage('s').clear() // 清空 sessionStorage
```

clearAll

清空所有 storage

``` js
storage().clearAll()
```