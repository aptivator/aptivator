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
  activationSequences[stateParams.stateName].forEach(function (viewConfigs) {
    var stateName = viewConfigs.stateName,
        viewAddressUnique = viewConfigs.viewAddressUnique,
        viewSelector = viewConfigs.viewSelector,
        viewStateName = viewConfigs.viewStateName;

    var parentRecord = activationRecords[registry[viewStateName].viewAddressUnique];
    var $parentEl = parentRecord.instance.$el;
    var $regionEl = !viewSelector ? $parentEl : $parentEl.find(viewSelector).eq(0);

    if (!$regionEl.length) {
      _error2.default.throw('region [' + viewSelector + '] does not exist for [' + viewStateName + '] state');
    }

    var parentRegions = parentRecord.regions || (parentRecord.regions = {});
    var targetRegion = parentRegions[viewSelector] || (parentRegions[viewSelector] = { current: new Set() });
    var activationRecord = activationRecords[viewAddressUnique] || (activationRecords[viewAddressUnique] = {});
    var cache = _cacheable2.default.total(viewConfigs, stateParams);
    var destroy = !cache && activationRecord.instance;
    var unhide = !destroy && !_lodash2.default.isEmpty(activationRecord);
    var family = _relations2.default.family(stateName).concat(viewAddressUnique);
    var viewParameters = _params2.default.assemble(family, stateParams);

    if (destroy) {
      _instance2.default.destroy({ name: viewAddressUnique });
    }

    targetRegion.current.add(viewAddressUnique);

    if (unhide) {
      if (_relations2.default.isRoot(viewStateName)) {
        _displayer2.default.roots.add(activationRecord.instance.$el);
      }

      if (!_cacheable2.default.implicit.cache) {
        if (!_lodash2.default.isObject(cache) || !cache.receiver) {
          _error2.default.throw('receiver function for variable parameters has not been provided');
        }

        activationRecord.instance[cache.receiver](viewParameters);
      }

      return _displayer2.default.single(activationRecord, $regionEl);
    }

    var instance = new viewConfigs.view(viewParameters);
    var serializeData = instance.serializeData;

    _lodash2.default.extend(activationRecord, { active: true, instance: instance, detached: true });

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

    instance.on('destroy', function () {
      delete activationRecord.instance;
      targetRegion.current.delete(viewAddressUnique);
      _lodash2.default.each(activationRecord.regions, function (regionObj) {
        regionObj.current.forEach(function (name) {
          _instance2.default.deactivate({ name: name, detach: true, focal: true });
        });
      });
    });

    instance.render();

    _displayer2.default.single(activationRecord, $regionEl);
  });

  _displayer2.default.roots.display();

  return stateParams;
};