'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('../../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _fragment = require('../../../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _route = require('../../../lib/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _dataStores = require('./lib/data-stores');

var _dataStores2 = _interopRequireDefault(_dataStores);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

exports.default = function (stateParams) {
  return new Promise(function (resolve, reject) {
    var stateName = stateParams.stateName,
        routeParams = stateParams.routeParams,
        routeValues = stateParams.routeValues,
        silent = stateParams.silent;

    var stateConfigs = registry[stateName];
    var rootStateConfigs = registry[_vars2.default.rootStateName];

    if (rootStateConfigs.showRuntime) {
      stateParams.time = Date.now();
    }

    if (!stateConfigs) {
      _error2.default.throw('invalid [' + stateName + '] state name', 'initializer');
    }

    if (!routeValues) {
      routeValues = stateConfigs.routeValues;
    }

    if (!stateConfigs.route) {
      silent = true;
    }

    if (!routeParams || _lodash2.default.isEmpty(routeParams)) {
      stateParams.routeParams = _route2.default.parts.assemble(stateName, routeValues);

      if (!silent) {
        _fragment2.default.set(stateParams.routeParams.fragment);
      }
    }

    _lodash2.default.extend(stateParams, _dataStores2.default);

    resolve(stateParams);
  });
};