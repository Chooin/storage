require('jest-localstorage-mock');
var storages = require('../lib/index.ts');

afterEach(function () {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

test('set to get', function () {
  // 无
  expect(window.localStorage.getItem('_')).toBeNull();
  expect(storages.default.get('_')).toBeNull();

  // Number
  storages.default.set('Number', 0);
  expect(window.localStorage.getItem('Number')).toEqual('0');
  expect(storages.default.get('Number')).toEqual(0);

  // Object
  storages.default.set('Object', {});
  expect(window.localStorage.getItem('Object')).toEqual('{}');
  expect(storages.default.get('Object')).toEqual({});

  // Array
  storages.default.set('Array', []);
  expect(window.localStorage.getItem('Array')).toEqual('[]');
  expect(storages.default.get('Array')).toEqual([]);

  // Boolean
  storages.default.set('Boolean', false);
  expect(window.localStorage.getItem('Boolean')).toEqual('false');
  expect(storages.default.get('Boolean')).toBeFalsy();

  // String
  storages.default.set('String', '0');
  expect(window.localStorage.getItem('String')).toEqual('0');
  expect(storages.default.get('String')).toEqual('0');

  // Undefined
  storages.default.set('Undefined', undefined);
  expect(window.localStorage.getItem('Undefined')).toBeNull();
  expect(storages.default.get('Undefined')).toBeNull();

  // Null
  storages.default.set('Null', null);
  expect(window.localStorage.getItem('Null')).toBeNull();
  expect(storages.default.get('Null')).toBeNull();
});

test('pre', function () {
  storages.default.set('Number', 0, {
    pre: 'pre_'
  });
  expect(window.localStorage.getItem('pre_Number')).toEqual('0');
  expect(storages.default.get('pre_Number')).toEqual(0);
});

test('sets to get', function () {
  storages.default.set([
    { key: 'Number', value: 123 },
    { key: 'Object', value: {} }
  ]);
  expect(window.localStorage.getItem('Number')).toEqual('123');
  expect(storages.default.get('Number')).toEqual(123);
  expect(window.localStorage.getItem('Object')).toEqual('{}');
  expect(storages.default.get('Object')).toEqual({});
});

test('noce', function () {
  storages.default.set('Number', 0);
  expect(storages.default.get('Number', {
    once: true
  })).toEqual(0);
  expect(window.localStorage.getItem('Number')).toEqual(null);
});

test('time out', function (done) {
  storages.default.set('TimeOut', 0, {
    expire: 1000
  });
  expect(window.localStorage.getItem('TimeOut')).toEqual('0');
  setTimeout(function () {
    expect(storages.default.get('TimeOut')).toEqual(null);
    done();
  }, 2000);
});

test('time not out', function (done) {
  storages.default.set('TimeNotOut', 0, {
    expire: 2000
  });
  expect(window.localStorage.getItem('TimeNotOut')).toEqual('0');
  setTimeout(function () {
    expect(storages.default.get('TimeNotOut')).toEqual(0);
    done();
  }, 1000);
});
