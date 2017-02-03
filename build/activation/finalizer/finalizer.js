'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  (0, _canceler2.default)(stateParams);

  _lodash2.default.extend(stateParams.flags, { pending: false, active: true });

  if (stateParams.time) {
    console.log('%cruntime: ' + (_lodash2.default.now() - stateParams.time) + 'ms', 'color: green;');
  }

  delete stateParams.time;

  return stateParams;
};