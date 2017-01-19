'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _missingParentsAssembler = require('./lib/missing-parents-assembler');

var _missingParentsAssembler2 = _interopRequireDefault(_missingParentsAssembler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queue = _vars2.default.states.queue;

exports.default = function () {
  return new Promise(function (resolve) {
    if (!queue.length) {
      return resolve();
    }

    var missingParents = (0, _missingParentsAssembler2.default)(queue);

    _error2.default.throw('undeclared parent states: [' + missingParents + ']', 'starter');
  });
};