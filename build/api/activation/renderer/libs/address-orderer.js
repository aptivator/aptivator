'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../../../libs/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _relations = require('../../../../libs/relations');

var _relations2 = _interopRequireDefault(_relations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var comparator = function comparator(viewAddress1, viewAddress2) {
  return _relations2.default.family(_addresser2.default.stateName(viewAddress1)).length > _relations2.default.family(_addresser2.default.stateName(viewAddress2)).length;
};

exports.default = function (viewAddresses) {
  var roots = viewAddresses.filter(function (viewAddress) {
    return _relations2.default.isRoot(_addresser2.default.stateName(viewAddress));
  });
  viewAddresses = _lodash2.default.difference(viewAddresses, roots);
  viewAddresses.sort(comparator);
  return roots.concat(viewAddresses);
};