'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  return new Promise(function (resolve, reject) {
    var transient = stateParams.transient,
        keepLast = stateParams.keepLast;

    var _ref = _instance2.default.history.prev() || {},
        lastStateName = _ref.stateName;

    var deactivate = function deactivate() {
      var keepLast = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : keepLast;

      if (!keepLast && lastStateName) {
        _instance2.default.deactivate({ name: lastStateName });
      }
      resolve(stateParams);
    };

    var _deactivate = deactivate;

    var _ref2 = transient || { activation: {} },
        activation = _ref2.activation;

    if (activation.promise instanceof Promise) {
      deactivate = function deactivate() {
        var _activation$params = activation.params,
            keepLast = _activation$params.keepLast,
            name = _activation$params.name;

        _instance2.default.deactivate({ name: name });
        _deactivate(!keepLast);
      };
    } else {
      activation.promise = Promise.resolve();
      deactivate = function deactivate() {
        clearTimeout(activation.timeout);
        _deactivate();
      };
    }

    activation.promise.then(deactivate).catch(reject);
  });
};