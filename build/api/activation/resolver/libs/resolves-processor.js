'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (resolves, resolveParams, storeKey, resolverParams) {
  return new Promise(function (resolve, reject) {
    if (!resolves) {
      return resolve();
    }

    var results = resolveParams[storeKey] || (resolveParams[storeKey] = {});
    var deps = void 0;
    var processedResolves = [];

    var storeResult = function storeResult(resolve, resolveName, result) {
      processedResolves.push(resolveName);
      if (resolve.persist || resolve.store) {
        results[resolveName] = result;
      }
    };

    !function processResolves(resolves) {
      var promises = [];
      var promiseNames = [];
      var dependents = {};

      _underscore2.default.each(resolves, function (resolve, resolveName) {
        if (resolve.persist && results[resolveName]) {
          return processedResolves.push(resolveName);
        }

        if (resolve.deps) {
          if (_underscore2.default.difference(resolve.deps, processedResolves).length) {
            return dependents[resolveName] = resolve;
          }
          _underscore2.default.extend(resolverParams.resolves, _underscore2.default.pick(resolveParams[storeKey], resolve.deps));
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

        if (!_underscore2.default.keys(dependents).length) {
          return resolve();
        }

        if (deps && _underscore2.default.isEqual(deps, dependents)) {
          dependents = _underscore2.default.keys(dependents).join(', ');
          return reject('some dependencies specified for [' + dependents + '] resolve(s) are not found');
        }

        processResolves(deps = dependents);
      });
    }(resolves);
  });
};