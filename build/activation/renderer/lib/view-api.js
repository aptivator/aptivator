'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routeAssembler = require('../../../lib/route/route-assembler');

var _routeAssembler2 = _interopRequireDefault(_routeAssembler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  href: function href(stateName) {
    for (var _len = arguments.length, routeValues = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      routeValues[_key - 1] = arguments[_key];
    }

    return '#' + (0, _routeAssembler2.default)(stateName, routeValues).fragment;
  }
};