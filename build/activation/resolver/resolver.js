'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _paramsAssembler = require('../../lib/params-assembler');

var _paramsAssembler2 = _interopRequireDefault(_paramsAssembler);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

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
          var params = (0, _paramsAssembler2.default)(entityName, stateParams);
          var promise = (0, _resolvesProcessor2.default)(resolveDefinitions[entityName], resolveParams, entityName, params);
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