'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fragment = require('../../../libs/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _route = require('../../../libs/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../../../libs/vars');

var _vars2 = _interopRequireDefault(_vars);

var _dataStores = require('./libs/data-stores');

var _dataStores2 = _interopRequireDefault(_dataStores);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

exports.default = function (callback, stateParams) {
  var stateName = stateParams.stateName,
      routeParams = stateParams.routeParams,
      routeValues = stateParams.routeValues,
      silent = stateParams.silent;

  var stateConfigs = registry[stateName];
  var rootStateConfigs = registry[_vars2.default.rootStateName];

  if (!stateConfigs) {
    callback('invalid [' + stateName + '] state name');
  }

  if (rootStateConfigs.showRuntime) {
    stateParams.time = Date.now();
  }

  if (!routeValues) {
    routeValues = stateConfigs.routeValues;
  }

  if (!stateConfigs.route) {
    silent = true;
  }

  if (!routeParams || _lodash2.default.isEmpty(routeParams)) {
    stateParams.routeParams = _route2.default.params.assemble(stateName, routeValues);

    if (!silent) {
      _fragment2.default.set(stateParams.routeParams.fragment);
    }
  }

  _lodash2.default.extend(stateParams, _dataStores2.default);

  callback();
};