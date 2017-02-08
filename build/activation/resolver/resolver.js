'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _params = require('../../lib/params');

var _params2 = _interopRequireDefault(_params);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

var _entitiesTreeBuilder = require('./lib/entities-tree-builder');

var _entitiesTreeBuilder2 = _interopRequireDefault(_entitiesTreeBuilder);

var _resolvesProcessor = require('./lib/resolves-processor');

var _resolvesProcessor2 = _interopRequireDefault(_resolvesProcessor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resolveDefinitions = _vars2.default.resolveDefinitions,
    resolveParams = _vars2.default.resolveParams,
    states = _vars2.default.states;
var registry = states.registry;

exports.default = function (stateParams) {
  return new Promise(function (resolve, reject) {
    (0, _canceler2.default)(stateParams);

    stateParams.flags.resolved = true;

    if (stateParams.flags.noResolves) {
      return resolve(stateParams);
    }

    var stateName = stateParams.stateName;

    var resolveAddresses = _relations2.default.family(stateName).reduce(function (resolveAddresses, relation) {
      return resolveAddresses.concat(registry[relation].resolveAddresses);
    }, []);
    var tree = (0, _entitiesTreeBuilder2.default)(resolveAddresses);

    !function process() {
      var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : tree;

      return new Promise(function (resolve, reject) {
        var promises = [];
        _lodash2.default.keys(node).forEach(function (entityName) {
          var stateName = _addresser2.default.stateName(entityName);
          var family = _relations2.default.family(stateName);
          var resolverParams = _params2.default.assemble(family, stateParams);
          var promise = (0, _resolvesProcessor2.default)(resolveDefinitions[entityName], resolveParams, entityName, resolverParams);
          promises.push(promise.then(function () {
            return process(node[entityName]);
          }).catch(reject));
        });
        Promise.all(promises).then(resolve).catch(reject);
      });
    }().then(function () {
      return resolve(stateParams);
    }).catch(reject);
  });
};