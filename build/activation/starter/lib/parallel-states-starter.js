'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

exports.default = function (stateName, stateParams) {
  var family = _relations2.default.family(stateName);
  var flags = stateParams.flags,
      route = stateParams.route,
      direct = stateParams.direct;
  var transient = flags.transient;


  _lodash2.default.each(family, function (relation) {
    var stateConfigs = registry[relation];
    _lodash2.default.each(stateConfigs.states, function (parallelStateParams) {
      parallelStateParams = _lodash2.default.cloneDeep(parallelStateParams);
      var _parallelStateParams = parallelStateParams,
          parallelDirect = _parallelStateParams.direct,
          parallelRoute = _parallelStateParams.route;


      if (direct && parallelDirect) {
        parallelStateParams.direct = direct;
      } else {
        delete parallelStateParams.direct;
      }

      if (route && parallelRoute) {
        parallelStateParams.route = route;
      } else {
        delete parallelStateParams.route;
      }

      _lodash2.default.extend(parallelStateParams.flags, { transient: transient });

      _instance2.default.activate(parallelStateParams);
    });
  });
};