'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _errorStater = require('../../lib/error-stater');

var _errorStater2 = _interopRequireDefault(_errorStater);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  _vars2.default.router.route('*error', _errorStater2.default);
};