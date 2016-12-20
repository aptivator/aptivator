'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _relations = require('./relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  region: function region(address) {
    return address.split('@')[0];
  },

  stateName: function stateName(viewAddress, containerStateName) {
    var stateName = viewAddress.split('@')[1];
    return !containerStateName ? stateName : stateName === '' ? _vars2.default.rootStateName : !stateName ? _relations2.default.parent(containerStateName) : stateName;
  },

  full: function full(viewAddress, containerStateName) {
    return this.region(viewAddress) + '@' + this.stateName(viewAddress, containerStateName);
  }
};