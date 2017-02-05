'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deactivator = require('./lib/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (params) {
  var focal = params.focal,
      forward = params.forward;

  var method = focal || forward ? 'partial' : 'full';
  _deactivator2.default[method](params);
};