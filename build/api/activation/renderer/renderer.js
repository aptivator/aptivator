'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _error = require('../../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _addressOrderer = require('./lib/address-orderer');

var _addressOrderer2 = _interopRequireDefault(_addressOrderer);

var _cacheable = require('./lib/cacheable');

var _cacheable2 = _interopRequireDefault(_cacheable);

var _multiplesTester = require('./lib/multiples-tester');

var _multiplesTester2 = _interopRequireDefault(_multiplesTester);

var _paramsAssembler = require('./lib/params-assembler');

var _paramsAssembler2 = _interopRequireDefault(_paramsAssembler);

var _remover = require('./lib/remover');

var _remover2 = _interopRequireDefault(_remover);

var _viewApi = require('./lib/view-api');

var _viewApi2 = _interopRequireDefault(_viewApi);

var _viewsDisplayer = require('./lib/views-displayer');

var _viewsDisplayer2 = _interopRequireDefault(_viewsDisplayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activationRecords = _vars2.default.states.activationRecords;

exports.default = function (callback, stateParams) {
  var activationSequence = stateParams.activationSequences[stateParams.stateName].activationSequence;


  function viewRenderer(viewAddressFull) {
    var parentStateName = _addresser2.default.stateName(viewAddressFull);
    var parentConfigs = _vars2.default.states.registry[parentStateName];
    var parentRecord = activationRecords[parentStateName];
    var regionName = _addresser2.default.region(viewAddressFull);
    var parentRegions = parentRecord.regions || (parentRecord.regions = {});
    var targetRegion = parentRegions[regionName] || (parentRegions[regionName] = {});
    var viewConfigs = activationSequence[viewAddressFull];
    var stateName = viewConfigs.stateName,
        main = viewConfigs.main,
        detachHidden = viewConfigs.detachHidden;

    var cacheAddress = main ? stateName : viewAddressFull;
    var activationRecord = activationRecords[cacheAddress];
    var cache = _cacheable2.default.total(viewConfigs, stateParams, cacheAddress);
    var destroy = !cache && activationRecord;
    var multiple = (0, _multiplesTester2.default)(parentConfigs, regionName);
    var hide = !multiple && targetRegion.current && (!destroy || destroy && !targetRegion.current.has(cacheAddress));
    var unhide = !destroy && activationRecord;
    var parentInstance = parentRecord.instance;
    var regionInstance = parentInstance[regionName];

    if (!targetRegion.current) {
      targetRegion.current = new Set();
    }

    if (!regionInstance) {
      _error2.default.throw('region [' + regionName + '] does not exist for [' + parentStateName + '] state');
    }

    regionInstance._ensureElement();

    if (destroy) {
      _remover2.default.destroy(activationRecord, multiple);
    }

    if (hide) {
      _remover2.default.hide({ targetRegion: targetRegion, cacheAddress: cacheAddress, detach: detachHidden });
    }

    targetRegion.current.add(cacheAddress);

    if (unhide) {
      if (!_cacheable2.default.implicit.cache) {
        if (!_lodash2.default.isObject(cache) || !cache.receiver) {
          _error2.default.throw('receiver function for variable parameters has not been provided');
        }

        var _parameters = (0, _paramsAssembler2.default)(viewConfigs, stateParams);
        activationRecord.instance[cache.receiver](_parameters);
      }

      (0, _viewsDisplayer2.default)({ cacheAddresses: targetRegion.current, regionInstance: regionInstance, activationSequence: activationSequence });

      return;
    }

    var parameters = (0, _paramsAssembler2.default)(viewConfigs, stateParams);
    var instance = new viewConfigs.view(parameters);
    var serializeData = instance.serializeData;

    instance.serializeData = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var data = serializeData && serializeData.apply(this, args);
      return _lodash2.default.extend(this.options, data, { aptivator: _viewApi2.default });
    };

    if (!main) {
      if (!parentRecord.immediates) {
        parentRecord.immediates = new Set();
      }

      parentRecord.immediates.add(cacheAddress);
    }

    _lodash2.default.extend(activationRecords[cacheAddress] || (activationRecords[cacheAddress] = {}), {
      instance: instance
    });

    (0, _viewsDisplayer2.default)({ cacheAddresses: targetRegion.current, regionInstance: regionInstance, excludes: [cacheAddress] });
    instance.render();
    regionInstance.$el.append(instance.$el);
  }

  try {
    (0, _addressOrderer2.default)(_lodash2.default.keys(activationSequence)).forEach(viewRenderer);
    callback();
  } catch (e) {
    callback(e);
  }
};