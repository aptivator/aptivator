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
  var view = registry[rootStateName].view;

  var instance = new view();

  instance.render();
  activationRecords[rootStateName] = { instance: instance };
};