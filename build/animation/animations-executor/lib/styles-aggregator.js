'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (el, mainProperty) {
  var computedStyles = window.getComputedStyle(el, null);
  return _lodash2.default.reduce(computedStyles, function (aggregator, property) {
    if (property.startsWith(mainProperty)) {
      aggregator.push(computedStyles[property]);
    }
    return aggregator;
  }, []).join(' ');
};