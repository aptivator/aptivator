'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _instance = require('../../../libs/instance');

var _instance2 = _interopRequireDefault(_instance);

var _error = require('../../../libs/error');

var _error2 = _interopRequireDefault(_error);

var _fragment = require('../../../libs/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _vars = require('../../../libs/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (err) {
  if (err) {
    return _error2.default.throw(err);
  }

  var rootStateConfigs = _vars2.default.states.registry[_vars2.default.rootStateName];
  var defaultStates = rootStateConfigs.defaultStates;


  _backbone2.default.history.start();

  if (!_fragment2.default.toState() && defaultStates) {
    defaultStates.forEach(function (stateName) {
      return _instance2.default.activate({ stateName: stateName, directParams: { running: true } });
    });
  }
};