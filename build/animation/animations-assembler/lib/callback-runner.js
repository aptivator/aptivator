'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _paramsAssembler = require('../../../lib/params-assembler');

var _paramsAssembler2 = _interopRequireDefault(_paramsAssembler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback, entityName, stateParams) {
  if (callback.length) {
    var params = (0, _paramsAssembler2.default)(entityName, stateParams);
  }

  return callback(params);
};