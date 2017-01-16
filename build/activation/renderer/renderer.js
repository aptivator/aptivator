'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _params = require('../../lib/params');

var _params2 = _interopRequireDefault(_params);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _cacheable = require('./lib/cacheable');

var _cacheable2 = _interopRequireDefault(_cacheable);

var _displayer = require('./lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

var _viewApi = require('./lib/view-api');

var _viewApi2 = _interopRequireDefault(_viewApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _vars$states = _vars2.default.states,
    activationRecords = _vars$states.activationRecords,
    activationSequences = _vars$states.activationSequences,
    registry = _vars$states.registry;

exports.default = function (stateParams) {
  var root$els = [];

  activationSequences[stateParams.stateName].forEach(function (viewConfigs) {
    var stateName = viewConfigs.stateName,
        viewAddressUnique = viewConfigs.viewAddressUnique,
        viewRegionName = viewConfigs.viewRegionName,
        viewStateName = viewConfigs.viewStateName,
        multiple = viewConfigs.multiple,
        transient = viewConfigs.transient;

    var parentRecord = activationRecords[registry[viewStateName].viewAddressUnique];
    var parentInstance = parentRecord.instance;
    var regionInstance = parentInstance[viewRegionName];
    var parentRegions = parentRecord.regions || (parentRecord.regions = {});
    var targetRegion = parentRegions[viewRegionName] || (parentRegions[viewRegionName] = { current: new Set() });
    var activationRecord = activationRecords[viewAddressUnique] || (activationRecords[viewAddressUnique] = {});
    var cache = _cacheable2.default.total(viewConfigs, stateParams);
    var destroy = !cache && activationRecord.instance;
    var unhide = !destroy && !_lodash2.default.isEmpty(activationRecord);
    var family = _relations2.default.family(stateName).concat(viewAddressUnique);
    var viewParameters = _params2.default.assemble(family, stateParams);

    if (!regionInstance) {
      _error2.default.throw('region [' + viewRegionName + '] does not exist for [' + viewStateName + '] state');
    }

    if (!regionInstance._aptivatorEnsuredElement) {
      regionInstance._aptivatorEnsuredElement = true;
      regionInstance._ensureElement();
    }

    if (destroy) {
      _instance2.default.destroy({ name: viewAddressUnique });
    }

    targetRegion.current.add(viewAddressUnique);

    if (unhide) {
      if (_relations2.default.isRoot(viewStateName)) {
        _displayer2.default.roots.add(activationRecord.instance.$el);
      }

      if (_relations2.default.isRoot(viewStateName)) {
        root$els.push(activationRecord.instance.$el);
      }

      if (!_cacheable2.default.implicit.cache) {
        if (!_lodash2.default.isObject(cache) || !cache.receiver) {
          _error2.default.throw('receiver function for variable parameters has not been provided');
        }

        activationRecord.instance[cache.receiver](viewParameters);
      }

      _displayer2.default.single(activationRecord, regionInstance);

      if (multiple) {
        _displayer2.default.multiple({ targetRegion: targetRegion, regionInstance: regionInstance, transient: transient, exclude: [viewAddressUnique] });
      }

      return;
    }

    var instance = new viewConfigs.view(viewParameters);
    var serializeData = instance.serializeData;

    _lodash2.default.extend(activationRecord, { active: true, instance: instance, transient: transient });

    instance.serializeData = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var data = serializeData && serializeData.apply(this, args);
      return _lodash2.default.extend(this.options, data, { aptivator: _viewApi2.default });
    };

    if (_relations2.default.isRoot(viewStateName)) {
      _displayer2.default.roots.add(activationRecord.instance.$el);
    }

    if (multiple) {
      _displayer2.default.multiple({ targetRegion: targetRegion, regionInstance: regionInstance, transient: transient, exclude: [viewAddressUnique] });
    }

    instance.on('destroy', function () {
      delete activationRecord.instance;
      targetRegion.current.delete(viewAddressUnique);
      _lodash2.default.each(activationRecord.regions, function (regionObj) {
        regionObj.current.forEach(function (name) {
          _instance2.default.deactivate({ name: name, detach: true, ignoreMultiple: true, focal: true });
        });
      });
    });

    instance.render();
    regionInstance.$el.append(instance.$el);
  });

  _displayer2.default.roots.display();

  return stateParams;
};