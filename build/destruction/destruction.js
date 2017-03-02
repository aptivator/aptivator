'use strict';

var _aptivator = require('../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _error = require('../lib/error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activationRecords = _vars2.default.states.activationRecords;


_aptivator2.default.destroy = function (params) {
  var name = params.name;

  var activationRecord = activationRecords[name];

  if (!activationRecord) {
    _error2.default.throw('state [' + name + '] has not been activated', 'state remover');
  }

  activationRecord.instance.destroy();
};