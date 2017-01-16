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

var _siblingsDisplayer = require('./lib/siblings-displayer');

var _siblingsDisplayer2 = _interopRequireDefault(_siblingsDisplayer);

var _viewApi = require('./lib/view-api');

var _viewApi2 = _interopRequireDefault(_viewApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _vars$states = _vars2.default.states,
    activationRecords = _vars$states.activationRecords,
    activationSequences = _vars$states.activationSequences,
    registry = _vars$states.registry;

exports.default = function (stateParams) {
  activationSequences[stateParams.stateName].forEach(function (viewConfigs) {
    var stateName = viewConfigs.stateName,
        viewAddressUnique = viewConfigs.viewAddressUnique,
        multiple = viewConfigs.multiple,
        viewRegionName = viewConfigs.viewRegionName,
        viewStateName = viewConfigs.viewStateName;

    var parentRecord = activationRecords[registry[viewStateName].viewAddressUnique];
    var parentInstance = parentRecord.instance;
    var regionInstance = parentInstance[viewRegionName];
    var parentRegions = parentRecord.regions || (parentRecord.regions = {});
    var targetRegion = parentRegions[viewRegionName] || (parentRegions[viewRegionName] = {});
    var activationRecord = activationRecords[viewAddressUnique] || (activationRecords[viewAddressUnique] = {});
    var cache = _cacheable2.default.total(viewConfigs, stateParams, viewAddressUnique);
    var destroy = !cache && activationRecord.instance;
    var unhide = !destroy && !_lodash2.default.isEmpty(activationRecord);
    var family = _relations2.default.family(stateName).concat(viewAddressUnique);
    var viewParameters = _params2.default.assemble(family, stateParams);

    if (!regionInstance) {
      _error2.default.throw('region [' + viewRegionName + '] does not exist for [' + viewStateName + '] state');
    }

    if (!targetRegion.current) {
      targetRegion.current = new Set();
    }

    regionInstance._ensureElement();

    if (destroy) {
      _instance2.default.destroy({ name: viewAddressUnique });
    }

    targetRegion.current.add(viewAddressUnique);

    if (unhide) {
      (0, _siblingsDisplayer2.default)({ targetRegion: targetRegion, regionInstance: regionInstance, multiple: multiple, includes: [viewAddressUnique] });

      if (!_cacheable2.default.implicit.cache) {
        if (!_lodash2.default.isObject(cache) || !cache.receiver) {
          _error2.default.throw('receiver function for variable parameters has not been provided');
        }

        activationRecord.instance[cache.receiver](viewParameters);
      }

      return;
    }

    var instance = new viewConfigs.view(viewParameters);
    var serializeData = instance.serializeData;

    instance.serializeData = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var data = serializeData && serializeData.apply(this, args);
      return _lodash2.default.extend(this.options, data, { aptivator: _viewApi2.default });
    };

    (0, _siblingsDisplayer2.default)({ targetRegion: targetRegion, regionInstance: regionInstance, multiple: multiple, excludes: [viewAddressUnique] });

    _lodash2.default.extend(activationRecord, { active: true, instance: instance });

    instance.on('destroy', function () {
      activationRecord.instance = null;
      targetRegion.current.delete(viewAddressUnique);
      _lodash2.default.each(activationRecord.regions, function (regionObj) {
        regionObj.current.forEach(function (name) {
          return _instance2.default.deactivate({ name: name, detach: true, ignoreMultiple: true, focal: true });
        });
      });
    });

    instance.render();
    regionInstance.$el.append(instance.$el);
  });

  return stateParams;
};