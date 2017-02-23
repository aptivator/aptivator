'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventRegistry = _vars2.default.eventRegistry,
    spaceSplitter = _vars2.default.spaceSplitter;

exports.default = function (events, callback, context, once) {
  if (_lodash2.default.isString(events) || _lodash2.default.isArray(events)) {
    if (_lodash2.default.isString(events)) {
      events = events.trim().split(spaceSplitter);
    }

    if (!_lodash2.default.isArray(callback)) {
      callback = [{ callback: callback, context: context }];
    }

    callback = callback.map(function (callbackRecord) {
      callbackRecord = _lodash2.default.isFunction(callbackRecord) ? { callback: callbackRecord } : callbackRecord;

      if (once) {
        callbackRecord.callback.once = true;
      }

      return callbackRecord;
    });

    return events.forEach(function (event) {
      var callbacks = eventRegistry[event] || (eventRegistry[event] = []);
      var lastCallbackRecord = _lodash2.default.last(callbacks);

      if (once) {
        var _ref = lastCallbackRecord || {},
            oncer = _ref.oncer;

        if (oncer) {
          lastCallbackRecord = callbacks.splice(callbacks.length - 1)[0];
        } else {
          var _callback = function _ignore() {
            var onces = _lodash2.default.filter(callbacks, function (callbackRecord) {
              return callbackRecord.callback.once;
            });

            _lodash2.default.each(onces, function (callbackRecord) {
              var callback = callbackRecord.callback,
                  context = callbackRecord.context;

              _instance2.default.off(event, callback, context);
            });
          };

          _callback.once = true;

          lastCallbackRecord = { callback: _callback, oncer: true };
        }

        callback.push(lastCallbackRecord);
      }

      callbacks.push.apply(callbacks, (0, _toConsumableArray3.default)(callback));
    });
  }

  var configs = events;
  var handlePartsBase = callback || [];

  _lodash2.default.each(configs, function (configs, eventName) {
    var callbacks = configs.callbacks;

    var handleParts = handlePartsBase.concat(eventName);

    if (_lodash2.default.isArray(configs)) {
      callbacks = configs;
    } else if (_lodash2.default.isFunction(configs) || _lodash2.default.has(configs, 'callback')) {
      callbacks = [configs];
    } else if (_lodash2.default.isFunction(callbacks) || _lodash2.default.has(callbacks, 'callback')) {
      callbacks = [callbacks];
    }

    if (callbacks) {
      var handleName = handleParts.join(':');
      _instance2.default.on(handleName, callbacks, null, once);
    }

    if (_lodash2.default.isPlainObject(configs)) {
      var childrenConfigs = _lodash2.default.omit(configs, 'callbacks');
      if (!_lodash2.default.isEmpty(childrenConfigs)) {
        _instance2.default.on(childrenConfigs, handleParts, null, once);
      }
    }
  });
};