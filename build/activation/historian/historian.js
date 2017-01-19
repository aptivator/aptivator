'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _adder = require('../../history/adder');

var _adder2 = _interopRequireDefault(_adder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  if (!stateParams.noHistory) {
    (0, _adder2.default)(_lodash2.default.cloneDeep(_lodash2.default.pick(stateParams, ['stateName'])));
  }

  return stateParams;
};