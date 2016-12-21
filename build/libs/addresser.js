'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var addresser = {
  parts: function parts(address) {
    return address.split('@');
  },

  region: function region(viewAddress) {
    return this.parts(viewAddress)[0];
  },
  stateName: function stateName(viewAddress) {
    return this.parts(viewAddress)[1];
  }
};

exports.default = addresser;