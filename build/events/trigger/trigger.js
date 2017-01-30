'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _triggerSequencer = require('./trigger-sequencer/trigger-sequencer');

var _triggerSequencer2 = _interopRequireDefault(_triggerSequencer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventSplitter = _vars2.default.eventSplitter;

exports.default = function (events) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (_lodash2.default.isString(events)) {
    events = events.split(eventSplitter);
  }

  var promises = [];
  var results = {};
  var triggerSequence = (0, _triggerSequencer2.default)(events, args);

  triggerSequence.forEach(function (record) {
    var args = record.args,
        handle = record.handle,
        callbacks = record.callbacks;

    var handlePath = handle.split(':').concat('v');
    var store = {};

    callbacks.forEach(function (callbackRecord) {
      var callback = callbackRecord.callback,
          context = callbackRecord.context;
      var name = callback.name;

      var result = callback.apply(context, args);

      result = Promise.resolve(result);
      result = result.then(function (result) {
        if (name) {
          if (!_lodash2.default.has(results, handlePath)) {
            _lodash2.default.set(results, handlePath, store);
          }

          if (_lodash2.default.has(store, name)) {
            _error2.default.throw('function [' + name + '] was already called for [' + handle + '] event', 'event triggerer');
          }

          _lodash2.default.set(store, name, result);
        }
      });

      promises.push(result);
    });
  });

  return Promise.all(promises).then(function () {
    return results;
  });
};