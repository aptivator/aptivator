'use strict';

var _instance = require('../libs/instance');

var _instance2 = _interopRequireDefault(_instance);

var _error = require('../libs/error');

var _error2 = _interopRequireDefault(_error);

var _route = require('../libs/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../libs/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.href = function (stateName) {
  for (var _len = arguments.length, routeValues = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    routeValues[_key - 1] = arguments[_key];
  }

  return !_vars2.default.states.registry[stateName] ? _error2.default.throw('state [' + stateName + '] does not exist') : !_vars2.default.states.registry[stateName].route ? _error2.default.throw('state [' + stateName + '] does not have a route') : '#' + _route2.default.params.assemble(stateName, routeValues).fragment;
};