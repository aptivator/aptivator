'use strict';

var _instance = require('../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _statesCache = require('./lib/states-cache');

var _statesCache2 = _interopRequireDefault(_statesCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.history = {
  get: function get(start, end) {
    return _statesCache2.default.slice(start, end);
  },
  size: function size() {
    return _statesCache2.default.length;
  },
  last: function last() {
    return this.get(-1)[0];
  },
  prev: function prev() {
    return this.get(-2, -1)[0];
  }
};