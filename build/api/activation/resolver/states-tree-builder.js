'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _addresser = require('../../../libs/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _relations = require('../../../libs/relations');

var _relations2 = _interopRequireDefault(_relations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (entityNames) {
  var tree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return entityNames.reduce(function (tree, entityName) {
    var hasAt = entityName.includes('@');
    var stateName = hasAt ? _addresser2.default.region(entityName) : entityName;
    var family = _relations2.default.family(stateName);
    var current = tree;

    family.reduce(function (tree, relation) {
      if (entityNames.includes(relation)) {
        current = current[relation] || (current[relation] = {});
      }
      return tree;
    }, tree);

    if (hasAt) {
      current[entityName] = null;
    }

    return tree;
  }, tree);
};