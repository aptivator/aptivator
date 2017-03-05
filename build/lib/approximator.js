'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
      var route = stateConfigs.route;


      if (!route) {
        continue;
      }

      if (route.rx.test(hash)) {
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
      var stateNameParts = _relations2.default.parts(stateName);

      if (stateNameParts.length > searchStateNameParts.length) {
        return;
      }

      for (var i = 0, l = stateNameParts.length; i < l; i++) {
        if (stateNameParts[i] !== searchStateNameParts[i]) {
          break;
        }
      }

      if (i > max) {
        searchStateName = stateName;
        max = i;
      }
    });

    return max ? searchStateName : this.fromStateName(stateType);
  }
};