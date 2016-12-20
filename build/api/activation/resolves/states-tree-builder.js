'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _relations = require('../../../libs/relations');

var _relations2 = _interopRequireDefault(_relations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateNames) {
  var tree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return stateNames.reduce(function (tree, stateName) {
    var family = _relations2.default.family(stateName);
    var current = tree;
    return family.reduce(function (tree, relation) {
      if (stateNames.includes(relation)) {
        current = current[relation] || (current[relation] = {});
      }
      return tree;
    }, tree);
  }, tree);
};