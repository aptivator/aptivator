'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;
exports.default = {
  isStateAddress: function isStateAddress(viewAddress) {
    if (!viewAddress.includes('@')) {
      return true;
    }

    var stateName = this.stateName(viewAddress);
    return registry[stateName].viewAddressUnique === viewAddress;
  },
  uniqueAddress: function uniqueAddress(stateName) {
    return _lodash2.default.uniqueId('aptivator-id-') + '@' + stateName;
  },


  parts: function parts(address) {
    return address.split('@');
  },

  region: function region(viewAddress) {
    return this.parts(viewAddress)[0];
  },
  stateName: function stateName(viewAddress) {
    return viewAddress.includes('@') ? this.parts(viewAddress)[1] : viewAddress;
  }
};