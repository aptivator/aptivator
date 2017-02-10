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
      events = events.split(spaceSplitter);
    }

    if (!_lodash2.default.isArray(callback)) {
      callback = [{ callback: callback, context: context }];
    }

    callback = callback.map(function (callbackRecord) {
      callbackRecord = _lodash2.default.isFunction(callbackRecord) ? { callback: callbackRecord } : callbackRecord;
      var _callbackRecord = callbackRecord,
          callback = _callbackRecord.callback,
          context = _callbackRecord.context;


      if (once) {
        (function () {
          var oncer = _lodash2.default.once(function () {
            _instance2.default.off(events, oncer, context);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return callback.apply(this, args);
          });

          callbackRecord.callback = oncer;
        })();
      }

      return callbackRecord;
    });

    return events.forEach(function (event) {
      var callbacks = eventRegistry[event] || (eventRegistry[event] = []);
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

    if (configs.sub) {
      _instance2.default.on(configs.sub, handleParts, null, once);
    }
  });
};