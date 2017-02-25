'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootStateProperties = ['view', 'resolves', 'data', 'route', 'resolveConfigs', 'detachHidden', 'animate'];

exports.default = function (stateName, stateConfigs) {
  stateConfigs = _lodash2.default.pick(stateConfigs, rootStateProperties);

  if (!stateConfigs.resolveConfigs) {
    stateConfigs.resolveConfigs = {
      duration: 0,
      store: true
    };
  }

  if (_lodash2.default.isUndefined(stateConfigs.detachHidden)) {
    stateConfigs.detachHidden = false;
  }

  return _lodash2.default.extend(stateConfigs, { root: true, uniqueAddress: _addresser2.default.uniqueAddress(stateName) });
};