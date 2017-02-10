'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;
exports.default = {
  uniqueAddress: function uniqueAddress(entityName) {
    var hasAt = entityName.includes('@');
    return hasAt ? entityName : registry[entityName].viewAddressUnique;
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