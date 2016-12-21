'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _params = require('../../../../lib/params');

var _params2 = _interopRequireDefault(_params);

var _relations = require('../../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (viewConfigs, stateParams) {
  var stateName = viewConfigs.stateName,
      viewAddressUnique = viewConfigs.viewAddressUnique;

  var family = _relations2.default.family(stateName).concat(viewAddressUnique);
  return _params2.default.assemble(family, stateParams);
};