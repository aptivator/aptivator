'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _relations = require('./relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var states = _vars2.default.states;
var registry = states.registry;
exports.default = {
  fromHash: function fromHash(hash) {
    if (!hash) {
      return;
    }

    for (var stateName in registry) {
      var stateConfigs = registry[stateName];

      if (!stateConfigs.route) {
        continue;
      }

      if (stateConfigs.routeRx.test(hash)) {
        return stateName;
      }
    }

    return this.fromHash(hash.split('/').slice(0, -1).join('/'));
  },
  fromStateName: function fromStateName(stateType, searchStateName) {
    if (!searchStateName) {
      return states[stateType].root;
    }

    var searchStateNameParts = _relations2.default.parts(searchStateName);
    var max = 0;

    states[stateType].forEach(function (stateName) {
      var intersection = _lodash2.default.intersection(searchStateNameParts, _relations2.default.parts(stateName));
      if (intersection.length > max) {
        searchStateName = stateName;
        max = intersection.length;
      }
    });

    return max ? searchStateName : this.fromStateName(stateType);
  }
};