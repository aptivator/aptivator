'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _animationsAssembler = require('./animations-assembler/animations-assembler');

var _animationsAssembler2 = _interopRequireDefault(_animationsAssembler);

var _stateNamesAggregator = require('./state-names-aggregator/state-names-aggregator');

var _stateNamesAggregator2 = _interopRequireDefault(_stateNamesAggregator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateNames, animationType) {
  stateNames = (0, _stateNamesAggregator2.default)(stateNames);
  return _lodash2.default.reduce(stateNames, function (animations, stateName) {
    (0, _animationsAssembler2.default)(stateName, animationType, animations);
    return animations;
  }, {});
};