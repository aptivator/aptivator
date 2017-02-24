'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _displayer = require('../../../lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

var _params = require('../../../lib/params');

var _params2 = _interopRequireDefault(_params);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _deactivator = require('../../../deactivation/deactivator/lib/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

var _rootViewRegistrar = require('./root-view-registrar');

var _rootViewRegistrar2 = _interopRequireDefault(_rootViewRegistrar);

var _viewApi = require('./view-api');

var _viewApi2 = _interopRequireDefault(_viewApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paramsMap = _vars2.default.paramsMap;

exports.default = function (viewConfigs, stateParams) {
  var view = viewConfigs.view,
      rendering = viewConfigs.rendering,
      uniqueAddress = viewConfigs.uniqueAddress,
      detachHidden = viewConfigs.detachHidden,
      addressStateName = viewConfigs.addressStateName,
      fullAddress = viewConfigs.fullAddress,
      stateName = viewConfigs.stateName,
      viewHash = viewConfigs.viewHash;
  var region = rendering.region,
      record = rendering.record;
  var instance = record.instance;


  if (instance) {
    console.log('destroying ' + fullAddress + ': ' + viewHash + ' @ ' + stateName);
    instance.destroy();
  }

  var family = _relations2.default.family(uniqueAddress);
  var viewParameters = _params2.default.assemble(family, stateParams);

  instance = new view(viewParameters);

  region.current.add(uniqueAddress);
  _lodash2.default.extend(record, { active: true, instance: instance, detached: true, detach: detachHidden });

  var serializeData = instance.serializeData;

  instance.serializeData = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var data = serializeData && serializeData.apply(this, args);
    return _lodash2.default.extend(this.options, data, { aptivator: _viewApi2.default });
  };

  instance.on('destroy', function () {
    _deactivator2.default.partial({ name: uniqueAddress, detach: { focal: true, children: true } });
    region.current.delete(uniqueAddress);
    //delete paramsMap[uniqueAddress];
    delete record.instance;
  });

  instance.render();

  if (_relations2.default.isRoot(addressStateName)) {
    return (0, _rootViewRegistrar2.default)(viewConfigs, stateParams);
  }

  (0, _displayer2.default)(viewConfigs);
};