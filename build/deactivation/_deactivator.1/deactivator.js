'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deactivator = require('./lib/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (params) {
  var method = params.partial ? 'partial' : 'full';
  _deactivator2.default[method](params);
};