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

var _deactivator = require('../../../deactivation/deactivator/lib/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

var _rootViewRegistrar = require('./root-view-registrar');

var _rootViewRegistrar2 = _interopRequireDefault(_rootViewRegistrar);

var _viewApi = require('./view-api');

var _viewApi2 = _interopRequireDefault(_viewApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (viewConfigs, stateParams) {
  var view = viewConfigs.view,
      record = viewConfigs.record,
      region = viewConfigs.region,
      uniqueAddress = viewConfigs.uniqueAddress,
      detachHidden = viewConfigs.detachHidden,
      addressStateName = viewConfigs.addressStateName;
  var instance = record.instance;


  if (instance) {
    instance.destroy();
  }

  var viewParameters = _params2.default.assemble(uniqueAddress, stateParams);

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
    delete record.instance;
  });

  instance.render();

  if (_relations2.default.isRoot(addressStateName)) {
    return (0, _rootViewRegistrar2.default)(viewConfigs, stateParams);
  }

  (0, _displayer2.default)(viewConfigs);
};