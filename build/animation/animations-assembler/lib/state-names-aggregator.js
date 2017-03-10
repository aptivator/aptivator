'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootStateName = _vars2.default.rootStateName;

exports.default = function (animationStates) {
  animationStates = _lodash2.default.reduce(animationStates, function (animationStates, animationState) {
    var stateParams = animationState.stateParams,
        stateName = animationState.stateName,
        beginningStateName = animationState.beginningStateName,
        primary = animationState.primary;

    var family = _relations2.default.family(stateName);
    var beginningIndex = family.indexOf(beginningStateName);
    family = family.slice(beginningIndex);

    _lodash2.default.each(family, function (stateName) {
      var existingIndex = _lodash2.default.findIndex(animationStates, { stateName: stateName });

      if (existingIndex > -1) {
        if (primary) {
          animationStates.splice(existingIndex, 1);
        } else {
          return;
        }
      }

      animationStates.push({ stateName: stateName, stateParams: stateParams });
    });

    return animationStates;
  }, []);

  animationStates.sort(_relations2.default.hierarchySorter());

  var rootIndex = _lodash2.default.findIndex(animationStates, { stateName: rootStateName });

  if (rootIndex > -1) {
    var rootState = animationStates.splice(rootIndex, 1)[0];
    animationStates.unshift(rootState);
  }

  return animationStates;
};