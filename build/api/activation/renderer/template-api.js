'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instance = require('../../../libs/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ['href'].reduce(function (o, methodName) {
  return o[methodName] = _instance2.default[methodName].bind(_instance2.default), o;
}, {});