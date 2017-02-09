'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instance = require('../../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var query = { flags: { active: true, parallel: false, transient: false } };
  var activeSerial = _instance2.default.history.findOne(query);

  if (activeSerial) {
    var stateName = activeSerial.stateName;

    _instance2.default.deactivate({ name: stateName, stateParams: activeSerial });
  }
};