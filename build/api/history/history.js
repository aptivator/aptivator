'use strict';

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var statesCache = [];

_instance2.default.history = {
  set: function set(state) {
    statesCache.push(state);
    statesCache = statesCache.slice(-_vars2.default.historySize);
  },
  get: function get(start, end) {
    return statesCache.slice(start, end);
  },
  size: function size() {
    return statesCache.length;
  },
  last: function last() {
    return this.get(-1)[0];
  },
  prev: function prev() {
    return this.get(-2, -1)[0];
  }
};