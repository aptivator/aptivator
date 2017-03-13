'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _aptivator = require('../../../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventRegistry = _vars2.default.eventRegistry,
    spaceSplitter = _vars2.default.spaceSplitter;

exports.default = function (events, callback, context, once) {
  if (_lodash2.default.isString(events)) {
    events = events.trim().split(spaceSplitter);
  }

  if (!_lodash2.default.isArray(callback)) {
    callback = [{ callback: callback, context: context }];
  }

  callback = _lodash2.default.map(callback, function (callbackRecord) {
    callbackRecord = _lodash2.default.isFunction(callbackRecord) ? { callback: callbackRecord } : callbackRecord;
    return _lodash2.default.extend(callbackRecord, { once: once });
  });

  _lodash2.default.each(events, function (event) {
    var callbacks = eventRegistry[event] || (eventRegistry[event] = []);

    if (once) {
      var onceRemover = _lodash2.default.findIndex(callbacks, { onceRemover: true });
      if (onceRemover !== -1) {
        onceRemover = callbacks.splice(onceRemover, 1)[0];
      } else {
        var _callback = function _ignore() {
          var onces = _lodash2.default.filter(callbacks, { once: true });

          _lodash2.default.each(onces, function (callbackRecord) {
            var callback = callbackRecord.callback,
                context = callbackRecord.context;

            _aptivator2.default.off(event, callback, context);
          });
        };

        onceRemover = { callback: _callback, once: true, onceRemover: true };
      }

      callback.push(onceRemover);
    }

    callbacks.push.apply(callbacks, (0, _toConsumableArray3.default)(callback));
  });
};