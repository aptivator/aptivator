'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _fragment = require('../../../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;


var findNearestStateName = function findNearestStateName(hash) {
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

  return findNearestStateName(hash.split('/').slice(0, -1).join('/'));
};

var determineOtherStateName = function determineOtherStateName(stateName, registeredStateNames) {
  if (!stateName) {
    return registeredStateNames.root;
  }

  var stateNameParts = _relations2.default.parts(stateName);
  var max = 0;

  registeredStateNames.forEach(function (errorStateName) {
    var intersection = _lodash2.default.intersection(stateNameParts, _relations2.default.parts(errorStateName));
    if (intersection.length > max) {
      stateName = errorStateName;
      max = intersection.length;
    }
  });

  return max ? stateName : determineOtherStateName(null, registeredStateNames);
};

var invalidRouteListener = function invalidRouteListener() {
  if (_fragment2.default.toState()) {
    return;
  }

  var hash = _fragment2.default.get();
  var stateName = findNearestStateName(hash);
  stateName = determineOtherStateName(stateName, _vars2.default.states.error);

  if (!stateName) {
    return alert('Provided route [' + hash + '] is invalid');
  }

  _instance2.default.activate({ stateName: stateName, direct: { fragment: hash } });
};

exports.default = function () {
  return new Promise(function (resolve) {
    (0, _jquery2.default)(function () {
      invalidRouteListener();
      setTimeout(function () {
        return (0, _jquery2.default)(window).on('hashchange', invalidRouteListener);
      });
    });

    resolve();
  });
};