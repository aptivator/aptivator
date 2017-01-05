'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invalidHashHandler = require('./lib/invalid-hash-handler');

var _invalidHashHandler2 = _interopRequireDefault(_invalidHashHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback) {
  (0, _invalidHashHandler2.default)();
  callback();
};