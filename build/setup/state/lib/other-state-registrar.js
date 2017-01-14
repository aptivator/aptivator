'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _error = require('../../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateName, registeredStateNames) {
  var parentStateName = _relations2.default.parent(stateName);

  if (_relations2.default.isRoot(_relations2.default.parent(stateName))) {
    return registeredStateNames.root = stateName;
  }

  registeredStateNames.forEach(function (registeredStateName) {
    if (_relations2.default.parent(registeredStateName) === parentStateName) {
      _error2.default.throw('already registered [' + registeredStateName + '] under [' + parentStateName + ']', 'state declaration');
    }
  });

  registeredStateNames.push(stateName);
};