'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('./addresser');

var _addresser2 = _interopRequireDefault(_addresser);

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
  family: function family(entityName) {
    if (!entityName) {
      return [];
    }

    var stateName = _addresser2.default.stateName(entityName);

    var family = this.parts(stateName);

    family = _lodash2.default.range(1, family.length + 1).map(function (end) {
      return family.slice(0, end).join('.');
    });

    if (!this.isRoot(stateName)) {
      family.unshift(_vars2.default.rootStateName);
    }

    if (entityName.includes('@')) {
      family.push(entityName);
    }

    return family;
  },
  parent: function parent(stateName) {
    return this.family(stateName).slice(-2, -1)[0];
  }
};