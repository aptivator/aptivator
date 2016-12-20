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

var _statesTreeBuilder = require('./states-tree-builder');

var _statesTreeBuilder2 = _interopRequireDefault(_statesTreeBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback, stateParams) {
  var resolveParams = stateParams.resolveParams,
      stateResolves = stateParams.stateResolves;

  var tree = (0, _statesTreeBuilder2.default)(_lodash2.default.keys(stateResolves));

  !function processResolves() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : tree;

    return new Promise(function (resolve, reject) {
      var promises = [];
      _lodash2.default.keys(node).forEach(function (stateName) {
        var family = _relations2.default.family(stateName);
        var resolverParams = _params2.default.assemble(family, stateParams);
        var promise = (0, _resolver2.default)(stateResolves[stateName], resolveParams, stateName, resolverParams);
        promises.push(promise.then(function () {
          return processResolves(node[stateName]);
        }).catch(reject));
      });
      Promise.all(promises).then(resolve).catch(reject);
    });
  }().then(function () {
    return callback();
  }).catch(callback);
};