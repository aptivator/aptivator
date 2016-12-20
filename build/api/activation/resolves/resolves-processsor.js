'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (resolvesObj, storeKey, storeObj, paramsObj) {
  return new Promise(function (resolve, reject) {
    if (!resolvesObj) {
      return resolve();
    }

    var results = storeObj[storeKey] || (storeObj[storeKey] = {});
    var deps = void 0;

    !function processResolves(resolvesObj) {
      var promises = [];
      var promiseNames = [];
      var dependents = {};
      var processedResolves = _underscore2.default.keys(results);

      _underscore2.default.each(resolvesObj, function (resolve, resolveName) {
        if (resolve.deps && _underscore2.default.difference(resolve.deps, processedResolves).length) {
          if (_underscore2.default.difference(resolve.deps, processedResolves).length) {
            return dependents[resolveName] = resolve;
          }
          _underscore2.default.extend(paramsObj.resolve, _underscore2.default.pick(storeObj[storeKey], resolve.deps));
        }

        var result = (resolve.callback || resolve)(paramsObj);

        if (result instanceof Promise) {
          promiseNames.push(resolveName);
          return promises.push(result);
        }

        results[resolveName] = result;
      });

      Promise.all(promises).then(function (data) {
        data.forEach(function (result, index) {
          return results[promiseNames[index]] = result;
        });

        if (!_underscore2.default.keys(dependents).length) {
          return resolve();
        }

        if (deps && _underscore2.default.isEqual(deps, dependents)) {
          var dependentNames = _underscore2.default.keys(dependents).join(', ');
          return reject('some dependencies specified for [' + dependentNames + '] resolve(s) are not found');
        }

        processResolves(deps = dependents);
      });
    }(resolvesObj);
  });
};