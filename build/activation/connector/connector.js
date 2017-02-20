'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  (0, _canceler2.default)(stateParams);
  return stateParams;
};