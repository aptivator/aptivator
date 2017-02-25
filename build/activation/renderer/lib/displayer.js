'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _displayer = require('../../../lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

var _params = require('../../../lib/params');

var _params2 = _interopRequireDefault(_params);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _rootViewRegistrar = require('./root-view-registrar');

var _rootViewRegistrar2 = _interopRequireDefault(_rootViewRegistrar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (viewConfigs, stateParams, cacheAssessor) {
  var addressStateName = viewConfigs.addressStateName,
      uniqueAddress = viewConfigs.uniqueAddress;


  if (!cacheAssessor.implicit.cache) {
    var cacheConfigs = cacheAssessor.explicit.cache;

    var _ref = cacheConfigs || {},
        receiver = _ref.receiver;

    if (receiver) {
      var instance = viewConfigs.record.instance;

      var family = _relations2.default.family(uniqueAddress);
      var viewParameters = _params2.default.assemble(family, stateParams);
      instance[receiver](viewParameters);
    }
  }

  if (_relations2.default.isRoot(addressStateName)) {
    (0, _rootViewRegistrar2.default)(viewConfigs, stateParams);
  }

  (0, _displayer2.default)(viewConfigs);
};