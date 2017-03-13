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
  isStateAddress: function isStateAddress(address) {
    if (!address.includes('@')) {
      return true;
    }

    var stateName = this.stateName(address);
    return registry[stateName].uniqueAddress === address;
  },
  uniqueAddress: function uniqueAddress(stateName) {
    return _lodash2.default.uniqueId('aptivator-id-') + '@' + stateName;
  },


  parts: function parts(address) {
    return address.split('@');
  },

  region: function region(address) {
    return this.parts(address)[0];
  },
  stateName: function stateName(address) {
    return address.includes('@') ? this.parts(address)[1] : address;
  },
  record: function record(address) {
    var stateName = this.stateName(address);
    var views = registry[stateName].views;

    return _lodash2.default.filter(views, { uniqueAddress: address })[0].record;
  }
};