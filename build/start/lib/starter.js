'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _fragment = require('../../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  return new Promise(function (resolve) {
    var rootStateConfigs = _vars2.default.states.registry[_vars2.default.rootStateName];
    var defaultState = rootStateConfigs.defaultState;


    _backbone2.default.history.start();

    if (!_fragment2.default.get() && defaultState) {
      _instance2.default.activate({ name: defaultState, direct: { running: true } }).then(function () {
        setTimeout(function () {
          return _instance2.default.deactivate({ name: 'header' });
        }, 2000);
      });
    }

    resolve();
  });
};