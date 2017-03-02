'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _animator = require('../../animation/animator');

var _animator2 = _interopRequireDefault(_animator);

var _aptivator = require('../../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _hookResulter = require('../../lib/hook-resulter');

var _hookResulter2 = _interopRequireDefault(_hookResulter);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _deactivator = require('./lib/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootStateName = _vars2.default.rootStateName;

var eventHandle = 'aptivator-goto-finish';

exports.default = function (stateParams) {
  return new Promise(function (resolve) {
    if (!stateParams) {
      return resolve();
    }

    stateParams.flags.deactivating = false;

    var query = { flags: { active: true, deactivating: true } };
    var deactivatingStates = _aptivator2.default.history.find(query);

    if (deactivatingStates.length) {
      _aptivator2.default.once(eventHandle, resolve);
      return;
    }

    var otherActives = _aptivator2.default.history.find(function (stateParams) {
      var _stateParams$flags = stateParams.flags,
          active = _stateParams$flags.active,
          deactivating = _stateParams$flags.deactivating;

      return active && _lodash2.default.isUndefined(deactivating);
    });

    query = { flags: { active: true, deactivating: false } };
    deactivatingStates = _aptivator2.default.history.find(query);

    var ancestorGroupings = {};
    var triggerables = [];

    _lodash2.default.each(deactivatingStates, function (stateParams) {
      var stateName = stateParams.stateName,
          flags = stateParams.flags;
      var partial = flags.partial;

      var ancestor = _relations2.default.parts(stateName)[0];
      var comparator = partial ? stateName : ancestor;
      var operator = partial ? 'gt' : 'gte';
      var actives = _lodash2.default.filter(otherActives, function (stateParams) {
        var stateName = stateParams.stateName;

        if (stateName.startsWith(comparator)) {
          return _lodash2.default[operator](stateName.length, comparator.length);
        }
      });

      actives.push(stateParams);
      triggerables.push.apply(triggerables, (0, _toConsumableArray3.default)(actives));
      _lodash2.default.remove(otherActives, function (stateParams) {
        return actives.includes(stateParams);
      });

      var grouping = ancestorGroupings[ancestor];

      if (!grouping) {
        grouping = { stateNames: [], min: stateName, max: stateName };
        ancestorGroupings[ancestor] = grouping;
      }

      var _grouping = grouping,
          min = _grouping.min,
          max = _grouping.max,
          stateNames = _grouping.stateNames;


      _lodash2.default.each(actives, function (stateParams) {
        var stateName = stateParams.stateName,
            flags = stateParams.flags;
        var partial = flags.partial;


        stateNames.push(stateName);

        if (!_relations2.default.isRoot(min)) {
          if (!partial) {
            min = rootStateName;
          } else if (min.length > stateName.length) {
            min = stateName;
          }
        }

        if (max.length < stateName.length) {
          max = stateName;
        }
      });

      stateNames.sort(_relations2.default.hierarchySorter());
      _lodash2.default.extend(grouping, { min: min, max: max });
    });

    var stateNamePairs = _lodash2.default.reduce(ancestorGroupings, function (pairs, grouping) {
      var min = grouping.min,
          stateNames = grouping.stateNames;

      _lodash2.default.each(stateNames, function (stateName) {
        return pairs.push([min, stateName]);
      });
      return pairs;
    }, []);

    var animationPromise = (0, _animator2.default)(stateNamePairs, 'exit').then(function () {
      _lodash2.default.each(ancestorGroupings, function (grouping) {
        var min = grouping.min,
            max = grouping.max,
            stateNames = grouping.stateNames;


        if (_relations2.default.isRoot(min)) {
          return _deactivator2.default.full({ name: max });
        }

        _lodash2.default.each(stateNames, function (stateName) {
          _deactivator2.default.partial({ name: stateName });
        });
      });

      _lodash2.default.each(triggerables, function (stateParams) {
        _lodash2.default.extend(stateParams.flags, { active: false, deactivated: true });
        var triggerObj = { handle: 'exit:' + stateParams.stateName, full: true, args: [stateParams] };
        _aptivator2.default.trigger(triggerObj).then(function (results) {
          return (0, _hookResulter2.default)('exit', stateParams, results);
        });
      });
    });

    resolve(animationPromise);
    _aptivator2.default.trigger(eventHandle);
  });
};