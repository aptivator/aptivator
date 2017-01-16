'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _instance = require('../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _hideClass = require('../lib/hide-class');

var _hideClass2 = _interopRequireDefault(_hideClass);

var _relations = require('../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _vars$states = _vars2.default.states,
    activationRecords = _vars$states.activationRecords,
    registry = _vars$states.registry;


_instance2.default.deactivate = function (params) {
  var name = params.name,
      forward = params.forward,
      focal = params.focal,
      processed = params.processed,
      detach = params.detach,
      ignoreMultiple = params.ignoreMultiple;

  var hasAt = name.includes('@');
  var stateName = hasAt ? _addresser2.default.stateName(name) : focal || forward ? name : _relations2.default.family(name).slice(1, 2)[0];
  var stateConfigs = registry[stateName];
  var viewAddressUnique = hasAt ? name : stateConfigs.viewAddressUnique;
  var viewsRegistry = stateConfigs.viewsRegistry;
  var _viewsRegistry$viewAd = viewsRegistry[viewAddressUnique],
      detachHidden = _viewsRegistry$viewAd.detachHidden,
      multiple = _viewsRegistry$viewAd.multiple;

  var activationRecord = activationRecords[viewAddressUnique];
  var $el = activationRecord.instance.$el;


  if (hasAt) {
    focal = true;
  }

  if (!processed) {
    params.processed = new Set();
  }

  params.processed.add(viewAddressUnique);

  if (multiple && !ignoreMultiple) {
    return;
  }

  if (detach) {
    detachHidden = true;
  }

  if (detachHidden) {
    $el.removeClass(_hideClass2.default).detach();
  } else {
    $el.addClass(_hideClass2.default);
  }

  activationRecord.detached = detachHidden;
  activationRecord.active = false;

  if (focal) {
    return;
  }

  _lodash2.default.each(activationRecord.regions, function (regionObj) {
    regionObj.current.forEach(function (name) {
      if (name.includes('@')) {
        params.processed.add(name);
        return;
      }

      _instance2.default.deactivate(_lodash2.default.extend(params, { name: name, forward: true }));
    });
  });

  _lodash2.default.each(viewsRegistry, function (viewConfigs) {
    var viewAddressUnique = viewConfigs.viewAddressUnique;

    if (!params.processed.has(viewAddressUnique)) {
      _instance2.default.deactivate(_lodash2.default.extend(params, { name: viewAddressUnique, focal: true, stateName: stateName }));
    }
  });

  _lodash2.default.each(stateConfigs.states, function (stateName) {
    return _instance2.default.deactivate({ name: stateName });
  });
};