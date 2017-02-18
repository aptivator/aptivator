'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _animationsAssembler = require('./animations-assembler/animations-assembler');

var _animationsAssembler2 = _interopRequireDefault(_animationsAssembler);

var _stateNamesCollector = require('./state-names-collector/state-names-collector');

var _stateNamesCollector2 = _interopRequireDefault(_stateNamesCollector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateNames, animationType) {
  stateNames = (0, _stateNamesCollector2.default)(stateNames);
  return _lodash2.default.reduce(stateNames, function (animations, stateName) {
    (0, _animationsAssembler2.default)(stateName, animationType, animations);
    return animations;
  }, {});
};