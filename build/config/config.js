'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _aptivator = require('../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _vars = require('../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _invalidRouteRegistrar = require('./lib/invalid-route-registrar');

var _invalidRouteRegistrar2 = _interopRequireDefault(_invalidRouteRegistrar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_aptivator2.default.config = function (configs) {
  _lodash2.default.extend(_vars2.default.configs, configs);
  (0, _invalidRouteRegistrar2.default)();
};