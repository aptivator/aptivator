'use strict';

var _instance = require('../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _vars = require('../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var history = _vars2.default.states.history;


_instance2.default.history = {
  get: function get(filterer) {
    return history.filter(filterer).reverse();
  },
  getOne: function getOne(filterer) {
    return this.get(filterer)[0];
  }
};