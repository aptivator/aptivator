'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (receivers) {
  if (_lodash2.default.isArray(receivers)) {
    receivers = _lodash2.default.reduce(receivers, function (receivers, receiver) {
      return _lodash2.default.extend(receivers, (0, _defineProperty3.default)({}, receiver, { complete: false }));
    }, {});
  }

  return receivers;
};