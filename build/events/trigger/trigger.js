'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _callbacker = require('../callbacker/callbacker');

var _callbacker2 = _interopRequireDefault(_callbacker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (events) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var promises = [];
  var results = {};

  (0, _callbacker2.default)(events, args).forEach(function (eventRecord) {
    var args = eventRecord.args,
        handle = eventRecord.handle,
        callbacks = eventRecord.callbacks;

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