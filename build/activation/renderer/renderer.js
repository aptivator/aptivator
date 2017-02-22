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

var _deactivator = require('../../deactivation/deactivator/lib/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

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
  (0, _canceler2.default)(stateParams);

  stateParams.flags.rendered = true;

  var rootViews = stateParams.rootViews = [];
  var augment = stateParams.flags.augment;


  activationSequences[stateParams.stateName].forEach(function (viewConfigs) {
    var uniqueAddress = viewConfigs.uniqueAddress,
        addressSelector = viewConfigs.addressSelector,
        addressStateName = viewConfigs.addressStateName,
        detachHidden = viewConfigs.detachHidden;

    var activationRecord = activationRecords[uniqueAddress] || (activationRecords[uniqueAddress] = {});

    if (augment && activationRecord.active) {
      return;
    }

    var parentUniqueAddress = registry[addressStateName].uniqueAddress;
    var parentRecord = activationRecords[parentUniqueAddress];
    var $parentEl = parentRecord.instance.$el;
    var $regionEl = !addressSelector ? $parentEl : $parentEl.find(addressSelector).eq(0);
    var parentRegions = parentRecord.regions || (parentRecord.regions = {});
    var targetRegion = parentRegions[addressSelector] || (parentRegions[addressSelector] = { current: new Set() });
    var cache = _cacheable2.default.total(viewConfigs, stateParams);
    var instance = activationRecord.instance;

    var destroy = !cache && instance;
    var unhide = !destroy && instance;
    var family = _relations2.default.family(uniqueAddress);
    var viewParameters = _params2.default.assemble(family, stateParams);

    if (!$regionEl.length) {
      _error2.default.throw('region [' + addressSelector + '] does not exist for [' + addressStateName + '] state');
    }

    if (destroy) {
      instance.destroy();
    }

    if (unhide) {
      if (!_cacheable2.default.implicit.cache) {
        if (_lodash2.default.isObject(cache) || cache.receiver) {
          instance[cache.receiver](viewParameters);
        }
      }

      if (_relations2.default.isRoot(addressStateName)) {
        rootViews.push([uniqueAddress, $regionEl]);
      }

      return (0, _displayer2.default)(uniqueAddress, $regionEl);
    }

    instance = new viewConfigs.view(viewParameters);
    var serializeData = instance.serializeData;

    targetRegion.current.add(uniqueAddress);

    _lodash2.default.extend(activationRecord, { active: true, instance: instance, detached: true, detach: detachHidden });

    instance.serializeData = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var data = serializeData && serializeData.apply(this, args);
      return _lodash2.default.extend(this.options, data, { aptivator: _viewApi2.default });
    };

    instance.on('destroy', function () {
      _deactivator2.default.partial({ name: uniqueAddress, detach: { children: true } });
      targetRegion.current.delete(uniqueAddress);
      delete activationRecord.instance;
    });

    instance.render();

    if (_relations2.default.isRoot(addressStateName)) {
      return rootViews.push([uniqueAddress, $regionEl]);
    }

    (0, _displayer2.default)(uniqueAddress, $regionEl);
  });

  return stateParams;
};