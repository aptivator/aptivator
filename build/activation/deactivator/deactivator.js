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

    if (transient) {
      (function () {
        var activationParams = transient.activationParams,
            activationPromise = transient.activationPromise,
            timeoutHandle = transient.timeoutHandle;

        if (!(activationPromise.promise instanceof Promise)) {
          clearTimeout(timeoutHandle);
          lastStateName && _instance2.default.deactivate({ name: lastStateName, ignoreMultiple: true });
          resolve(stateParams);
        } else {
          activationPromise.promise.then(function () {
            var keepLast = activationParams.keepLast,
                name = activationParams.name;


            _instance2.default.deactivate({ name: name, ignoreMultiple: true });

            if (keepLast && lastStateName) {
              _instance2.default.deactivate({ name: lastStateName });
            }

            resolve(stateParams);
          }).catch(reject);
        }
      })();
    } else {
      if (!keepLast && lastStateName) {
        _instance2.default.deactivate({ name: lastStateName, ignoreMultiple: true });
      }

      resolve(stateParams);
    }
  });
};