'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootStateName = _vars2.default.rootStateName,
    states = _vars2.default.states;
var registry = states.registry,
    activationRecords = states.activationRecords;

exports.default = function () {
  var _registry$rootStateNa = registry[rootStateName],
      view = _registry$rootStateNa.view,
      viewAddressUnique = _registry$rootStateNa.viewAddressUnique;

  var instance = new view();

  instance.render();
  activationRecords[viewAddressUnique] = { instance: instance, active: true };
};