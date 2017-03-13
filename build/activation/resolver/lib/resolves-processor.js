'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('../../../lib/error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (resolves, resolveParams, storeKey, resolverParams) {
  return new Promise(function (resolve, reject) {
    if (!resolves) {
      return resolve();
    }

    var deps = void 0;
    var processedResolves = [];
    var results = resolveParams[storeKey] || (resolveParams[storeKey] = {});

    var storeResult = function storeResult(resolve, resolveName, result) {
      resolve.timestamp = _lodash2.default.now();
      processedResolves.push(resolveName);
      if (resolve.store) {
        results[resolveName] = result;
      }
    };

    !function processResolves(resolves) {
      var promises = [];
      var promiseNames = [];
      var dependents = {};

      _lodash2.default.each(resolves, function (resolve, resolveName) {
        var duration = resolve.duration,
            timestamp = resolve.timestamp;


        if (timestamp && _lodash2.default.now() - timestamp < duration) {
          return processedResolves.push(resolveName);
        }

        if (resolve.deps) {
          if (_lodash2.default.difference(resolve.deps, processedResolves).length) {
            return dependents[resolveName] = resolve;
          }

          _lodash2.default.extend(resolverParams.resolves, _lodash2.default.pick(resolveParams[storeKey], resolve.deps));
        }

        var result = resolve.resolver(resolverParams);

        if (result instanceof Promise) {
          promiseNames.push(resolveName);
          return promises.push(result);
        }

        storeResult(resolve, resolveName, result);
      });

      Promise.all(promises).then(function (data) {
        data.forEach(function (result, index) {
          var resolveName = promiseNames[index];
          var resolve = resolves[resolveName];

          storeResult(resolve, resolveName, result);
        });

        if (!_lodash2.default.keys(dependents).length) {
          return resolve();
        }

        if (deps && _lodash2.default.isEqual(deps, dependents)) {
          dependents = _lodash2.default.keys(dependents).join(', ');
          _error2.default.throw('some dependencies specified for [' + dependents + '] resolve(s) are not found', 'resolver');
        }

        processResolves(deps = dependents);
      }).catch(reject);
    }(resolves);
  });
};