'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

  (0, _callbacker2.default)(events, [callback, context]).forEach(function (eventRecord) {
    var callbacks = eventRecord.callbacks,
        args = eventRecord.args;

    var _args = (0, _slicedToArray3.default)(args, 2),
        callback = _args[0],
        context = _args[1];

    var query = {};

    if (callback) {
      _lodash2.default.extend(query, { callback: callback });
    }

    if (context) {
      _lodash2.default.extend(query, { context: context });
    }

    if (_lodash2.default.isEmpty(query)) {
      return callbacks.splice(0, callbacks.length);
    }

    _lodash2.default.filter(callbacks, query).forEach(function (callbackRecord) {
      var index = callbacks.indexOf(callbackRecord);
      callbacks.splice(index, 1);
    });
  });
};