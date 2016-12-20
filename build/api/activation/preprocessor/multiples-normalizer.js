'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateConfigs) {
  var multiples = stateConfigs.multiples;


  if (!multiples || _lodash2.default.isObject(multiples) && !_lodash2.default.isArray(multiples)) {
    return;
  }

  stateConfigs.multiples = multiples.reduce(function (o, multiple) {
    if (_lodash2.default.isString(multiple)) {
      o[multiple] = {
        prepend: false
      };
    }

    if (_lodash2.default.isObject(multiple)) {
      _lodash2.default.extend(o, multiple);
    }

    return o;
  }, {});
};