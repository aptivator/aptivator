'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _callbacker = require('./lib/callbacker');

var _callbacker2 = _interopRequireDefault(_callbacker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spaceSplitter = _vars2.default.spaceSplitter;


var levels = function levels(record) {
  return record.handle.split(':').length;
};

exports.default = function (events, mainArgs) {
  if (_lodash2.default.isString(events)) {
    events = events.split(spaceSplitter);
  }

  if (!_lodash2.default.isArray(events)) {
    events = [events];
  }

  var callbacks = (0, _callbacker2.default)(events, mainArgs);
  callbacks = _lodash2.default.uniqWith(callbacks, _lodash2.default.isEqual);
  return callbacks.sort(function () {
    return levels(arguments.length <= 0 ? undefined : arguments[0]) - levels(arguments.length <= 1 ? undefined : arguments[1]);
  });
};