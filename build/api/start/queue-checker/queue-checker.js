'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queue = _vars2.default.states.queue;

exports.default = function (callback) {
  if (!queue.length) {
    return callback();
  }

  var undefinedStateNames = queue.map(function (stateDefinition) {
    return stateDefinition[0];
  }).join(', ');

  callback('unable to initialize [' + undefinedStateNames + '] states');
};