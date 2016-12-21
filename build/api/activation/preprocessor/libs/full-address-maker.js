'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _addresser = require('../../../../libs/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _relations = require('../../../../libs/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../../libs/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (viewAddress, containerStateName) {
  var _addresser$parts = _addresser2.default.parts(viewAddress),
      _addresser$parts2 = _slicedToArray(_addresser$parts, 2),
      region = _addresser$parts2[0],
      stateName = _addresser$parts2[1];

  if (!stateName) {
    stateName = _relations2.default.parent(containerStateName);
  } else if (stateName === '') {
    stateName = _vars2.default.rootStateName;
  }

  return region + '@' + stateName;
};