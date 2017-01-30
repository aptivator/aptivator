'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = callbacker;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventRegistry = _vars2.default.eventRegistry;
function callbacker(events, mainArgs) {
  var callbacks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  events.forEach(function (event) {
    if (_lodash2.default.isString(event)) {
      if (!_lodash2.default.isEmpty(eventRegistry[event])) {
        callbacks.push({ handle: event, args: mainArgs, callbacks: eventRegistry[event] });
      }
      return;
    }

    var handle = event.handle,
        full = event.full,
        args = event.args;


    if (full) {
      handle = handle.split(':');
      handle = _lodash2.default.range(1, handle.length + 1).map(function (end) {
        return handle.slice(0, end).join(':');
      });
    } else {
      handle = [handle];
    }

    handle.forEach(function (handle) {
      return callbacker([handle], args || mainArgs, callbacks);
    });
  });

  return callbacks;
}