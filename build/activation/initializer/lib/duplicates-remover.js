'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _error = require('../../../lib/error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (startedStates) {
  var serialStates = _lodash2.default.filter(startedStates, { flags: { parallel: false } });
  var serialStatesDuplicates = serialStates.reverse().slice(1);

  if (serialStatesDuplicates.length) {
    _error2.default.warn('included two serial states in an activation', 'initializer');
  }

  serialStates = _lodash2.default.difference(serialStates, serialStatesDuplicates);

  serialStatesDuplicates.forEach(function (stateParams) {
    _lodash2.default.extend(stateParams.flags, { active: false, canceled: true, pending: false, duplicateSerial: true });
  });

  startedStates = _lodash2.default.difference(startedStates, serialStatesDuplicates);

  var deactivationPromises = [];

  if (serialStates.length) {
    var query = { flags: { parallel: false, pending: true, canceled: false, transient: false, preprocessed: true } };
    var pendingSerialState = _instance2.default.history.findOne(query);

    if (pendingSerialState) {
      var flags = pendingSerialState.flags,
          transientStateParams = pendingSerialState.transientStateParams,
          stateName = pendingSerialState.stateName,
          parallels = pendingSerialState.parallels;
      var transientFlags = transientStateParams.flags,
          transientStateName = transientStateParams.stateName,
          owners = transientStateParams.owners,
          transientParallels = transientStateParams.transientParallels;


      owners.delete(pendingSerialState);

      if (!owners.size) {
        var active = transientFlags.active,
            rendered = transientFlags.rendered;

        if (!active) {
          _lodash2.default.extend(transientFlags, { canceled: true });
        }

        if (rendered) {
          _lodash2.default.extend(transientFlags, { active: true });
          var promise = _instance2.default.deactivate({ name: transientStateName }).catch(_lodash2.default.noop);
          deactivationPromises.push(promise);
        }
      }

      _lodash2.default.each(false, function (stateParams) {
        var flags = stateParams.flags,
            stateName = stateParams.stateName;
        var active = flags.active,
            rendered = flags.rendered;


        if (!active) {
          _lodash2.default.extend(flags, { canceled: true });
        }

        if (rendered) {
          _lodash2.default.extend(flags, { active: true });
          var _promise = _instance2.default.deactivate({ name: stateName }).catch(_lodash2.default.noop);
          deactivationPromises.push(_promise);
        }
      });

      _lodash2.default.extend(flags, { canceled: true });

      if (flags.rendered) {
        _lodash2.default.extend(flags, { active: true });
        var _promise2 = _instance2.default.deactivate({ name: stateName }).catch(_lodash2.default.noop);
        deactivationPromises.push(_promise2);
      }
    }
  }

  return Promise.all(deactivationPromises).then(function () {
    return startedStates;
  });
};