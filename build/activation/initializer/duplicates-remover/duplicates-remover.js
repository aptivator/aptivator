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

  if (serialStates.length) {
    var query = { flags: { parallel: false, pending: true, canceled: false, transient: false, preprocessed: true } };
    var pendingSerialState = _instance2.default.history.findOne(query);

    if (pendingSerialState) {
      var flags = pendingSerialState.flags,
          transientStateParams = pendingSerialState.transientStateParams,
          stateName = pendingSerialState.stateName;
      var transientFlags = transientStateParams.flags,
          transientStateName = transientStateParams.stateName,
          owners = transientStateParams.owners;


      owners.delete(pendingSerialState);

      if (!owners.size) {
        var active = transientFlags.active;

        if (!active) {
          _lodash2.default.extend(transientFlags, { canceled: true });
        }

        _instance2.default.deactivate({ name: transientStateName, stateParams: transientStateParams, silent: !active });
      }

      _lodash2.default.extend(flags, { canceled: true });
      _instance2.default.deactivate({ name: stateName, stateParams: pendingSerialState, silent: true });
    }
  }

  return startedStates;
};