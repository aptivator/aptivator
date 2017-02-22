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

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

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
    stateParams.flags.deactivating = false;

    var query = { flags: { active: true, deactivating: true } };
    var deactivatingStates = _instance2.default.history.find(query);

    if (deactivatingStates.length) {
      _instance2.default.once(eventHandle, resolve);
      return;
    }

    var otherActives = _instance2.default.history.find(function (stateParams) {
      var _stateParams$flags = stateParams.flags,
          active = _stateParams$flags.active,
          deactivating = _stateParams$flags.deactivating;

      if (active && _lodash2.default.isUndefined(deactivating)) {
        return true;
      }
    });

    query = { flags: { active: true, deactivating: false } };
    deactivatingStates = _instance2.default.history.find(query);

    var deactivationRecords = {};
    var deactivationFinalists = [];

    _lodash2.default.each(deactivatingStates, function (stateParams) {
      var stateName = stateParams.stateName,
          flags = stateParams.flags;
      var partial = flags.partial;

      var firstAncestorName = _relations2.default.parts(stateName)[0];
      var actives = _lodash2.default.filter(otherActives, function (stateParams) {
        return stateParams.stateName.startsWith(partial ? stateName : firstAncestorName);
      });

      actives.push(stateParams);
      deactivationFinalists.push.apply(deactivationFinalists, (0, _toConsumableArray3.default)(actives));
      _lodash2.default.remove(otherActives, function (stateParams) {
        return actives.includes(stateParams);
      });

      var record = deactivationRecords[firstAncestorName];

      if (!record) {
        record = { stateNames: [], min: stateName, max: stateName };
        deactivationRecords[firstAncestorName] = record;
      }

      var _record = record,
          min = _record.min,
          max = _record.max,
          stateNames = _record.stateNames;


      _lodash2.default.each(actives, function (stateParams) {
        var stateName = stateParams.stateName,
            flags = stateParams.flags;
        var partial = flags.partial;


        stateNames.push(stateName);

        if (!partial) {
          if (min !== rootStateName) {
            min = rootStateName;
          }
        } else {
          if (min.length > stateName.length) {
            min = stateName;
          }
        }

        if (max.length < stateName.length) {
          max = stateName;
        }
      });

      stateNames.sort(_relations2.default.hierarchySorter());
      _lodash2.default.extend(record, { min: min, max: max });
    });

    var stateNamePairs = _lodash2.default.reduce(deactivationRecords, function (pairs, record) {
      var min = record.min,
          stateNames = record.stateNames;

      _lodash2.default.each(stateNames, function (stateName) {
        return pairs.push([min, stateName]);
      });
      return pairs;
    }, []);

    var animationPromise = (0, _animator2.default)(stateNamePairs, 'exit').then(function () {
      _lodash2.default.each(deactivationRecords, function (record) {
        var min = record.min,
            max = record.max,
            stateNames = record.stateNames;


        if (min === rootStateName) {
          return _deactivator2.default.full({ name: max });
        }

        _lodash2.default.each(stateNames, function (stateName) {
          _deactivator2.default.partial({ name: stateName });
        });
      });

      _lodash2.default.each(deactivationFinalists, function (stateParams) {
        var stateName = stateParams.stateName;

        _instance2.default.trigger({ handle: 'exit:' + stateName, full: true }, stateParams).then(function (results) {
          _lodash2.default.extend(stateParams.flags, { active: false, deactivated: true });
          (0, _hookResulter2.default)(stateParams, 'exit', results);
        });
      });
    });

    resolve(animationPromise);
    _instance2.default.trigger(eventHandle);
  });
};