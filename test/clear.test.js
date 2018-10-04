require('jest-localstorage-mock')
var storage = require('../lib/index.ts')

afterEach(function () {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

test('.clear()', function () {
  storage.default.set('Number', 0);
  storage.default.set('String', '0');
  storage.default.clear();
  expect(window.localStorage.getItem('Number')).toBeNull();
  expect(window.localStorage.getItem('String')).toBeNull();
});

test('.clear(config)', function () {
  var pre = '1.clear(config)';
  var pre_2 = '2.clear(config)';
  storage.default.set('Number', 0, {
    pre: pre
  });
  storage.default.set('Number', 0, {
    pre: pre_2
  });
  storage.default.clear({
    pre: pre
  });
  expect(window.localStorage.getItem(`${pre}Number`)).toBeNull();
  expect(window.localStorage.getItem(`${pre_2}Number`)).toEqual('0');
});
