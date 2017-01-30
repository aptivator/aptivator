'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _callbacker = require('../callbacker/callbacker');

var _callbacker2 = _interopRequireDefault(_callbacker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventRegistry = _vars2.default.eventRegistry;

exports.default = function (events, callback, context) {
  if (!events) {
    events = _lodash2.default.keys(eventRegistry);
    return events.forEach(function (event) {
      return delete eventRegistry[event];
    });
  }

  (0, _callbacker2.default)(events).forEach(function (eventRecord) {
    var callbacks = eventRecord.callbacks;

    callbacks.splice(0, callbacks.length);
  });
};