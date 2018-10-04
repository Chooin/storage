require('jest-localstorage-mock');
var storage = require('../lib/index.ts');

afterEach(function () {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

test('.remove(key)', function () {
  storage.default.set('String', '0');
  expect(window.localStorage.getItem('String')).toEqual('0');
  storage.default.remove('String');
  expect(window.localStorage.getItem('String')).toBeNull();
});

test('.remove(key, config)', function () {
  var pre = '1.remove(key, config)_';
  storage.default.set('String', '0', { pre: pre });
  expect(window.localStorage.getItem(pre + 'String')).toEqual('0');
  storage.default.remove('String', { pre: pre });
  expect(window.localStorage.getItem(pre + 'String')).toBeNull();
});

test('.remove([key])', function () {
  storage.default.set('String', '0');
  storage.default.set('Number', 0);
  expect(window.localStorage.getItem('String')).toEqual('0');
  expect(window.localStorage.getItem('Number')).toEqual('0');
  storage.default.remove(['String', 'Number']);
  expect(window.localStorage.getItem('String')).toBeNull();
  expect(window.localStorage.getItem('Number')).toBeNull();
});

test('.remove([key], config)', function () {
  var pre = '1.remove([key], config)_';
  storage.default.set('String', '0', { pre: pre });
  storage.default.set('Number', 0, { pre: pre });
  expect(window.localStorage.getItem(pre + 'String')).toEqual('0');
  expect(window.localStorage.getItem(pre + 'Number')).toEqual('0');
  storage.default.remove(['String', 'Number'], { pre: pre });
  expect(window.localStorage.getItem(pre + 'String')).toBeNull();
  expect(window.localStorage.getItem(pre + 'Number')).toBeNull();
});
