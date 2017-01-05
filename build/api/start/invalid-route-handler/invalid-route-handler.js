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

var determineErrorStateName = function determineErrorStateName(stateName) {
  if (!stateName || !_vars2.default.states.error.nested.length) {
    return _vars2.default.states.error.root[0];
  }

  var stateNameParts = stateName.split('.');
  var partsCount = 0;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _vars2.default.states.error.nested[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var errorStateName = _step.value;

      var errorStateNameParts = errorStateName.split('.');
      var intersection = _lodash2.default.intersection(stateNameParts, errorStateNameParts);
      if (intersection.length > partsCount) {
        stateName = errorStateName;
        partsCount = intersection.length;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return partsCount ? stateName : determineErrorStateName();
};

var invalidRouteListener = function invalidRouteListener(evt) {
  if (_fragment2.default.toState()) {
    return;
  }

  var hash = _fragment2.default.get();

  console.log(hash);

  var stateName = findNearestStateName(hash);

  console.log(stateName);

  stateName = determineErrorStateName(stateName);

  console.log(stateName);

  if (!stateName) {
    return alert('Provided route [' + hash + '] is invalid');
  }

  _instance2.default.activate({ stateName: stateName, directParams: { fragment: hash } });
};

exports.default = function (callback) {
  (0, _jquery2.default)(function () {
    invalidRouteListener();
    setTimeout(function () {
      return (0, _jquery2.default)(window).on('hashchange', invalidRouteListener);
    });
  });

  callback();
};