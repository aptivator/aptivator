'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var events = {};

_lodash2.default.extend(_instance2.default, {
  on: function on(name, callback, context) {
    var handlers = events[name] || (events[name] = []);
    handlers.push({ callback: callback, context: context });
  },
  trigger: function trigger(name) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var promises = [];
    var results = {};
    var names = _lodash2.default.isString(name) ? [name] : name;

    names.forEach(function (name) {
      return _lodash2.default.each(events[name], function (handler) {
        var callback = handler.callback,
            context = handler.context;

        var callbackName = callback.name;
        var result = callback.apply(context, args);
        result = Promise.resolve(result);
        result = result.then(function (result) {
          if (callbackName) {
            results[callbackName] = result;
          }
        });

        promises.push(result);
      });
    });

    return Promise.all(promises).then(function () {
      return results;
    });
  }
});