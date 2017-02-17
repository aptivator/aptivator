'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _animationsAssembler = require('./animations-assembler/animations-assembler');

var _animationsAssembler2 = _interopRequireDefault(_animationsAssembler);

var _animationsExecutor = require('./animations-executor/animations-executor');

var _animationsExecutor2 = _interopRequireDefault(_animationsExecutor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateNames, animationType) {
  var animations = (0, _animationsAssembler2.default)(stateNames, animationType);
  return (0, _animationsExecutor2.default)(animations);
};