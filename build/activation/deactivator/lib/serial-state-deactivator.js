'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _aptivator = require('../../../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var query = { flags: { active: true, parallel: false, transient: false } };
  var activeSerial = _aptivator2.default.history.findOne(query);

  if (activeSerial) {
    return _aptivator2.default.deactivate({ name: activeSerial.stateName }).catch(_lodash2.default.noop);
  }

  return Promise.resolve();
};