'use strict';

var _instance = require('./instance');

var _instance2 = _interopRequireDefault(_instance);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.history = {
  states: [],

  set: function set(state) {
    this.states.push(state);
    this.states = this.states.slice(-_vars2.default.historySize);
  },
  get: function get(start, end) {
    return this.states.slice(start, end);
  },
  size: function size() {
    return this.states.length;
  },
  last: function last() {
    return this.get(-1)[0];
  },
  prev: function prev() {
    return this.get(-2, -1)[0];
  }
};