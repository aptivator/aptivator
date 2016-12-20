'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _params = require('../../../libs/params');

var _params2 = _interopRequireDefault(_params);

var _relations = require('../../../libs/relations');

var _relations2 = _interopRequireDefault(_relations);

var _resolver = require('./resolver');

var _resolver2 = _interopRequireDefault(_resolver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback, stateParams) {
  var resolveParams = stateParams.resolveParams,
      viewResolves = stateParams.viewResolves;

  var promises = [];

  _lodash2.default.each(viewResolves, function (resolveObjs, viewsStateName) {
    return promises.push(new Promise(function (resolve, reject) {
      var family = _relations2.default.family(viewsStateName);
      _lodash2.default.each(resolveObjs, function (resolveObj) {
        var address = _lodash2.default.keys(resolveObj)[0];
        var resolvesObj = resolveObj[address];
        var resolverParams = _params2.default.assemble(family, stateParams);
        promises.push((0, _resolver2.default)(resolvesObj, resolveParams, address, resolverParams));
      });
      Promise.all(promises).then(resolve).catch(reject);
    }));
  });

  Promise.all(promises).then(function () {
    return callback();
  }).catch(callback);
};