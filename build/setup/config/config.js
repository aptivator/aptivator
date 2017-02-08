'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _invalidRouteRegistrar = require('./invalid-route-registrar/invalid-route-registrar');

var _invalidRouteRegistrar2 = _interopRequireDefault(_invalidRouteRegistrar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.config = function (configs) {
  _lodash2.default.extend(_vars2.default.configs, configs);
  (0, _invalidRouteRegistrar2.default)();
  return _instance2.default;
};