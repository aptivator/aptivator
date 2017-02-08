'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  uniqueStateAddress: function uniqueStateAddress(stateName) {
    return _vars2.default.states.registry[stateName].viewAddressUnique;
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