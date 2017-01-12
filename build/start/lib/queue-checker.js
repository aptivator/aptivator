'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queue = _vars2.default.states.queue;

exports.default = function () {
  return new Promise(function (resolve) {
    if (!queue.length) {
      return resolve();
    }

    var undefinedStateNames = queue.map(function (stateDefinition) {
      return stateDefinition[0];
    }).join(', ');
    _error2.default.throw('unable to initialize [' + undefinedStateNames + '] states');
  });
};