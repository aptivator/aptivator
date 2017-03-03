'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class(instance, receiver, receiverConfigs, params) {
    (0, _classCallCheck3.default)(this, _class);
    var _instance$events = instance.events,
        events = _instance$events === undefined ? {} : _instance$events;

    var method = events[receiver] || receiver;

    _lodash2.default.extend(this, {
      data: {},
      types: {},
      instance: instance,
      method: method,
      receiverConfigs: receiverConfigs,
      params: params
    });

    return this.handler.bind(this);
  }

  (0, _createClass3.default)(_class, [{
    key: 'resolver',
    value: function resolver(result, storeAs) {
      var _this = this;

      var data = this.data,
          receiverConfigs = this.receiverConfigs,
          instance = this.instance,
          params = this.params,
          method = this.method;
      var complete = receiverConfigs.complete,
          reset = receiverConfigs.reset;


      data[storeAs] = result;

      if (complete) {
        if (_lodash2.default.keys(data).length < params.length) {
          return;
        }

        if (reset) {
          setTimeout(function () {
            return _this.data = {};
          });
        }
      }

      instance[method].call(instance, data);
    }
  }, {
    key: 'handler',
    value: function handler(storeAs, result) {
      var types = this.types,
          resolver = this.resolver,
          rejector = this.rejector;

      resolver = resolver.bind(this);

      if (result instanceof Promise) {
        var promise = result.then(function (result) {
          return resolver(result, storeAs);
        });

        if (types[storeAs] instanceof Promise) {
          return types[storeAs] = types[storeAs].then(promise).catch(rejector);
        }

        return types[storeAs] = result.then(promise).catch(rejector);
      }

      resolver(result, storeAs);
    }
  }], [{
    key: 'rejector',
    value: function rejector(error) {
      throw error;
    }
  }]);
  return _class;
}();

exports.default = _class;