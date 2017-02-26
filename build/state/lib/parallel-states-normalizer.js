'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (states, stateName) {
  return _lodash2.default.each(states, function (stateConfigs, index) {
    if (_lodash2.default.isString(stateConfigs)) {
      stateConfigs = {
        name: stateConfigs,
        route: true,
        direct: true
      };
    }

    if (stateName.includes(stateConfigs.name)) {
      return states.splice(index, 1);
    }

    if (!stateConfigs.flags) {
      stateConfigs.flags = {};
    }

    _lodash2.default.extend(stateConfigs.flags, { parallel: true });

    states.splice(index, 1, stateConfigs);
  });
};