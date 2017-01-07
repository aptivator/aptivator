'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  isRoot: function isRoot(stateName) {
    return stateName === _vars2.default.rootStateName;
  },

  parts: function parts(stateName) {
    return stateName.split('.');
  },
  family: function family(stateName) {
    if (!stateName) {
      return [];
    }

    var family = this.parts(stateName);

    family = _lodash2.default.range(1, family.length + 1).map(function (end) {
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