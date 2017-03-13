'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _animationsAssembler = require('./lib/animations-assembler');

var _animationsAssembler2 = _interopRequireDefault(_animationsAssembler);

var _stateNamesAggregator = require('./lib/state-names-aggregator');

var _stateNamesAggregator2 = _interopRequireDefault(_stateNamesAggregator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (animationStates, animationType) {
  animationStates = (0, _stateNamesAggregator2.default)(animationStates);
  return _lodash2.default.reduce(animationStates, function (animations, animationState) {
    var stateName = animationState.stateName,
        stateParams = animationState.stateParams;

    (0, _animationsAssembler2.default)(stateName, stateParams, animationType, animations);
    return animations;
  }, {});
};