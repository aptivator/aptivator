'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
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