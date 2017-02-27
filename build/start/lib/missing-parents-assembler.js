'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (queue) {
  var parentNames = [];
  var stateNames = queue.map(function (stateDefinition) {
    return stateDefinition[0];
  });

  stateNames.sort(_relations2.default.hierarchySorter(true));

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = stateNames.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
          i = _step$value[0],
          stateName = _step$value[1];

      var parentName = _relations2.default.parent(stateName);

      if (parentNames.includes(parentName)) {
        continue;
      }

      if (!stateNames.includes(parentName, i + 1)) {
        parentNames.push(parentName);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return parentNames.reverse().join(', ');
};