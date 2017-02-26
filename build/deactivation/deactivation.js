'use strict';

var _instance = require('../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _errorer = require('../errorer/errorer');

var _errorer2 = _interopRequireDefault(_errorer);

var _starter = require('./starter/starter');

var _starter2 = _interopRequireDefault(_starter);

var _deactivator = require('./deactivator/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.deactivate = function (params) {
  return (0, _starter2.default)(params).then(_deactivator2.default).catch(_errorer2.default);
};