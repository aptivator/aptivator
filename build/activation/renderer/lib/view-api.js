'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _error = require('../../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _route = require('../../../lib/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  href: function href(stateName) {
    for (var _len = arguments.length, routeValues = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      routeValues[_key - 1] = arguments[_key];
    }

    var stateConfigs = _vars2.default.states.registry[stateName];

    if (!stateConfigs) {
      _error2.default.throw('state [' + stateName + '] does not exist', 'view api');
    }

    if (!stateConfigs.route) {
      _error2.default.throw('state [' + stateName + '] does not have a route', 'view api');
    }

    if (!routeValues) {
      routeValues = stateConfigs.routeValues;
    }

    return '#' + _route2.default.parts.assemble(stateName, routeValues).fragment;
  }
};