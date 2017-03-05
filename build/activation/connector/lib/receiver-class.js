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

var _errorer = require('../../../errorer/errorer');

var _errorer2 = _interopRequireDefault(_errorer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class(instance, receiver, receiverConfigs, params) {
    (0, _classCallCheck3.default)(this, _class);
    var _instance$events = instance.events,
        events = _instance$events === undefined ? {} : _instance$events;

    var method = events[receiver] || receiver;
    method = instance[method].bind(instance);

    _lodash2.default.extend(this, { data: {}, instance: instance, method: method, receiverConfigs: receiverConfigs, params: params });
    return this.handler.bind(this);
  }

  (0, _createClass3.default)(_class, [{
    key: 'handler',
    value: function handler(result, storeAs) {
      var _this = this;

      var data = this.data,
          receiverConfigs = this.receiverConfigs,
          params = this.params,
          method = this.method;
      var complete = receiverConfigs.complete,
          reset = receiverConfigs.reset;

      var previous = Promise.resolve(data[storeAs]);
      var current = Promise.resolve(result);

      previous.then(function () {
        return current;
      }).then(function (result) {
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

        method(data);
      }).catch(function (e) {
        return (0, _errorer2.default)({ errorType: e });
      }).catch(_lodash2.default.noop);
    }
  }]);
  return _class;
}();

exports.default = _class;