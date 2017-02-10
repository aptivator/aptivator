'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (events, callback, context) {
  _instance2.default.on(events, callback, context, true);
};