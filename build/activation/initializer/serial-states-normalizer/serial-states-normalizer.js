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
  var serialStates = startedStates.filter(function (stateParams) {
    return !stateParams.flags.parallel;
  });
  var serialStatesDuplicates = serialStates.reverse().slice(1);

  if (serialStatesDuplicates.length) {
    _error2.default.warn('included two serial states in an activation', 'initializer');
  }

  serialStates = _lodash2.default.difference(serialStates, serialStatesDuplicates);

  serialStatesDuplicates.forEach(function (stateParams) {
    _lodash2.default.extend(stateParams.flags, { active: false, canceled: true, pending: false, duplicateSerial: true });
  });

  startedStates = _lodash2.default.difference(startedStates, serialStatesDuplicates);

  if (serialStates.length) {
    var pendingSerialStateParams = _instance2.default.history.getOne(function (stateParams) {
      var _stateParams$flags = stateParams.flags,
          parallel = _stateParams$flags.parallel,
          pending = _stateParams$flags.pending,
          canceled = _stateParams$flags.canceled,
          transient = _stateParams$flags.transient,
          preprocessed = _stateParams$flags.preprocessed;

      if (!parallel && pending && !canceled && !transient && preprocessed) {
        return true;
      }
    });

    if (pendingSerialStateParams) {
      var flags = pendingSerialStateParams.flags,
          transientStateParams = pendingSerialStateParams.transientStateParams,
          stateName = pendingSerialStateParams.stateName;
      var transientFlags = transientStateParams.flags,
          transientStateName = transientStateParams.stateName,
          owners = transientStateParams.owners;


      owners.delete(pendingSerialStateParams);

      if (!owners.size) {
        var active = transientFlags.active;

        if (!active) {
          _lodash2.default.extend(transientFlags, { canceled: true });
        }

        _instance2.default.deactivate({ name: transientStateName, stateParams: transientStateParams, silent: !active });
      }

      _lodash2.default.extend(flags, { canceled: true });
      _instance2.default.deactivate({ name: stateName, pendingSerialStateParams: pendingSerialStateParams, silent: true });
    }
  }

  return startedStates;
};