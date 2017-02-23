'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _registrar = require('./lib/registrar');

var _registrar2 = _interopRequireDefault(_registrar);

var _unwinder = require('./lib/unwinder');

var _unwinder2 = _interopRequireDefault(_unwinder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (events, callback, context, once) {
  if (_lodash2.default.isString(events) || _lodash2.default.isArray(events)) {
    return (0, _registrar2.default)(events, callback, context, once);
  }

  (0, _unwinder2.default)(events, [], once);
};