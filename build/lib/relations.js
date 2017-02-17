'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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
  },
  hierarchySorter: function hierarchySorter(desc) {
    var _this = this;

    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _args$map = args.map(function (stateName) {
        return _this.parts(stateName).length;
      }),
          _args$map2 = (0, _slicedToArray3.default)(_args$map, 2),
          length1 = _args$map2[0],
          length2 = _args$map2[1];

      if (desc) {
        var _ref = [length1, length2];
        length2 = _ref[0];
        length1 = _ref[1];
      }

      return length1 - length2;
    };
  }
};