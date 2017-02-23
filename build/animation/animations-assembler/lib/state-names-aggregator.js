'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = stateNamesAggregator;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootStateName = _vars2.default.rootStateName,
    states = _vars2.default.states;
var registry = states.registry;
function stateNamesAggregator(stateNames) {
  stateNames = _lodash2.default.reduce(stateNames, function (stateNames, stateNameArr) {
    if (!_lodash2.default.isArray(stateNameArr)) {
      stateNameArr = [rootStateName, stateNameArr];
    }

    var _stateNameArr = stateNameArr,
        _stateNameArr2 = (0, _slicedToArray3.default)(_stateNameArr, 2),
        min = _stateNameArr2[0],
        stateName = _stateNameArr2[1];

    var stateConfigs = registry[stateName];
    var states = stateConfigs.states;

    var family = _relations2.default.family(stateName);
    var minIndex = family.indexOf(min);

    family = family.slice(minIndex);

    if (states) {
      stateNames.push.apply(stateNames, (0, _toConsumableArray3.default)(stateNamesAggregator(states)));
    }

    stateNames.push.apply(stateNames, (0, _toConsumableArray3.default)(family));
    return stateNames;
  }, []);

  stateNames = _lodash2.default.uniq(stateNames);
  stateNames = _lodash2.default.difference(stateNames, [rootStateName]);
  stateNames.sort(_relations2.default.hierarchySorter()).unshift(rootStateName);

  return stateNames;
}