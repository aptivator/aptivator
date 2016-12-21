'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vars = require('../../../libs/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback) {
  if (!_vars2.default.states.queue.length) {
    return callback();
  }

  var undefinedStateNames = _vars2.default.states.queue.map(function (stateDefinition) {
    return stateDefinition[0];
  }).join(', ');

  callback('unable to initialize [' + undefinedStateNames + '] states');
};