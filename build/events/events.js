'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _configsTransformer = require('./lib/configs-transformer');

var _configsTransformer2 = _interopRequireDefault(_configsTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _events = {};

_lodash2.default.extend(_instance2.default, {
  on: function on(configs) {
    var _this = this;

    var master = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _events;

    if (_lodash2.default.isString(configs)) {
      configs = (0, _configsTransformer2.default)(configs, master);
      return this.on(configs);
    }

    _lodash2.default.each(configs, function (configs, eventName) {
      var eventConfigs = master[eventName] || (master[eventName] = {});
      var callbacks = configs.callbacks;


      if (_lodash2.default.isFunction(configs)) {
        callbacks = [configs];
      } else if (_lodash2.default.isArray(configs)) {
        callbacks = configs;
      } else if (_lodash2.default.isFunction(callbacks)) {
        callbacks = [callbacks];
      }

      if (callbacks) {
        var eventCallbacks = eventConfigs.callbacks || (eventConfigs.callbacks = []);
        eventCallbacks.splice.apply(eventCallbacks, [eventCallbacks.length, 0].concat((0, _toConsumableArray3.default)(callbacks)));
      }

      if (configs.sub) {
        eventConfigs.sub || (eventConfigs.sub = {});
        _this.on(configs.sub, eventConfigs.sub);
      }
    });
  },
  trigger: function trigger(path) {},
  events: function events() {
    return _events;
  }
});

_lodash2.default.extend(_instance2.default, {
  trigger: function trigger(name) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var promises = [];
    var results = {};
    var names = _lodash2.default.isString(name) ? [name] : name;

    names.forEach(function (name) {
      return _lodash2.default.each(_events[name], function (handler) {
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