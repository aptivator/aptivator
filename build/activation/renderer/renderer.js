'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _displayer = require('../../lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

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

var _viewApi = require('./lib/view-api');

var _viewApi2 = _interopRequireDefault(_viewApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _vars$states = _vars2.default.states,
    activationRecords = _vars$states.activationRecords,
    activationSequences = _vars$states.activationSequences,
    registry = _vars$states.registry;

exports.default = function (stateParams) {
  stateParams.flags.rendered = true;

  var rootViews = stateParams.rootViews = [];
  var augment = stateParams.flags.augment;


  activationSequences[stateParams.stateName].forEach(function (viewConfigs) {
    var viewAddressUnique = viewConfigs.viewAddressUnique,
        viewSelector = viewConfigs.viewSelector,
        viewStateName = viewConfigs.viewStateName,
        detachHidden = viewConfigs.detachHidden;

    var activationRecord = activationRecords[viewAddressUnique] || (activationRecords[viewAddressUnique] = {});

    if (augment && activationRecord.active) {
      return;
    }

    var parentViewAddressUnique = registry[viewStateName].viewAddressUnique;
    var parentRecord = activationRecords[parentViewAddressUnique];
    var $parentEl = parentRecord.instance.$el;
    var $regionEl = !viewSelector ? $parentEl : $parentEl.find(viewSelector).eq(0);
    var parentRegions = parentRecord.regions || (parentRecord.regions = {});
    var targetRegion = parentRegions[viewSelector] || (parentRegions[viewSelector] = { current: new Set() });
    var cache = _cacheable2.default.total(viewConfigs, stateParams);
    var destroy = !cache && activationRecord.instance;
    var unhide = !destroy && activationRecord.instance;
    var family = _relations2.default.family(viewAddressUnique);
    var viewParameters = _params2.default.assemble(family, stateParams);

    if (!$regionEl.length) {
      _error2.default.throw('region [' + viewSelector + '] does not exist for [' + viewStateName + '] state');
    }

    if (destroy) {
      _instance2.default.destroy({ name: viewAddressUnique });
    }

    if (unhide) {
      if (!_cacheable2.default.implicit.cache) {
        if (_lodash2.default.isObject(cache) || cache.receiver) {
          activationRecord.instance[cache.receiver](viewParameters);
        }
      }

      if (_relations2.default.isRoot(viewStateName)) {
        rootViews.push([viewAddressUnique, $regionEl]);
      }

      return (0, _displayer2.default)(viewAddressUnique, $regionEl);
    }

    var instance = new viewConfigs.view(viewParameters);
    var serializeData = instance.serializeData;

    targetRegion.current.add(viewAddressUnique);

    _lodash2.default.extend(activationRecord, { active: true, instance: instance, detached: true, detach: detachHidden });

    instance.serializeData = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var data = serializeData && serializeData.apply(this, args);
      return _lodash2.default.extend(this.options, data, { aptivator: _viewApi2.default });
    };

    instance.on('destroy', function () {
      _instance2.default.deactivate({ name: viewAddressUnique, partial: true, detach: { children: true } });
      targetRegion.current.delete(viewAddressUnique);
      delete activationRecord.instance;
    });

    instance.render();

    if (_relations2.default.isRoot(viewStateName)) {
      return rootViews.push([viewAddressUnique, $regionEl]);
    }

    (0, _displayer2.default)(viewAddressUnique, $regionEl);
  });

  return stateParams;
};