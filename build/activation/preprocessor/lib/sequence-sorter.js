'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _addresser = require('../../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (activationSequence) {
  return activationSequence.sort(function (viewConfigs1, viewConfigs2) {
    return _relations2.default.parts(_addresser2.default.stateName(viewConfigs1.viewAddressUnique)).length > _relations2.default.parts(_addresser2.default.stateName(viewConfigs2.viewAddressUnique)).length;
  });
};