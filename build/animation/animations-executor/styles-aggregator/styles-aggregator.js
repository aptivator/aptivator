'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (el, mainStyle) {
  var computedStyles = window.getComputedStyle(el, null);
  return _lodash2.default.reduce(computedStyles, function (accumulator, value) {
    if (value.startsWith(mainStyle)) {
      accumulator.push(computedStyles[value]);
    }
    return accumulator;
  }, []).join(' ');
};