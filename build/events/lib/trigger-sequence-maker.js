'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventRegistry = _vars2.default.eventRegistry;


var sequenceMaker = function sequenceMaker(events, mainArgs) {
  var triggerSequence = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  events.forEach(function (event) {
    if (_lodash2.default.isString(event)) {
      if (eventRegistry[event]) {
        triggerSequence.push({ handle: event, args: mainArgs, callbacks: eventRegistry[event] });
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
      return sequenceMaker([handle], args || mainArgs, triggerSequence);
    });
  });

  return triggerSequence;
};

exports.default = function (events, mainArgs) {
  return sequenceMaker(events, mainArgs).sort(function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args[0].handle.split(':').length - args[1].handle.split(':').length;
  });
};