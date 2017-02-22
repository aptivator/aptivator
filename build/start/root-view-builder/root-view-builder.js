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
      uniqueAddress = _registry$rootStateNa.uniqueAddress;

  var instance = new view();

  instance.render();
  activationRecords[uniqueAddress] = { instance: instance, active: true };
};