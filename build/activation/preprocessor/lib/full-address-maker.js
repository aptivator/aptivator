'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _addresser = require('../../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (viewAddress, containerStateName) {
  var _addresser$parts = _addresser2.default.parts(viewAddress),
      _addresser$parts2 = (0, _slicedToArray3.default)(_addresser$parts, 2),
      selector = _addresser$parts2[0],
      stateName = _addresser$parts2[1];

  if (stateName === '') {
    stateName = _vars2.default.rootStateName;
  } else if (!stateName) {
    stateName = _relations2.default.parent(containerStateName);
  }

  return selector + '@' + stateName;
};