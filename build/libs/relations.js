'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  isRoot: function isRoot(stateName) {
    return stateName === _vars2.default.rootStateName;
  },

  family: function family(stateName) {
    if (!stateName) {
      return [];
    }

    var family = stateName.split('.');

    family = _underscore2.default.range(1, family.length + 1).map(function (end) {
      return family.slice(0, end).join('.');
    });

    if (!this.isRoot(stateName)) {
      family.unshift(_vars2.default.rootStateName);
    }

    return family;
  },
  parent: function parent(stateName) {
    return this.family(stateName).slice(-2, -1)[0];
  }
};