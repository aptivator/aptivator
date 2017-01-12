'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
      startStateName = params.startStateName,
      stateName = params.stateName,
      detach = params.detach;

  var hasAt = name.includes('@');
  stateName = stateName ? stateName : hasAt ? _addresser2.default.stateName(name) : focal || forward ? name : _relations2.default.family(name).slice(1, 2)[0];
  var stateConfigs = registry[stateName];
  var viewsRegistry = stateConfigs.viewsRegistry;

  var viewConfigs = viewsRegistry[hasAt ? name : stateConfigs.viewAddressFull];
  var detachHidden = viewConfigs.detachHidden,
      viewAddressFull = viewConfigs.viewAddressFull,
      cacheAddress = viewConfigs.cacheAddress;

  var _addresser$parts = _addresser2.default.parts(viewAddressFull),
      _addresser$parts2 = _slicedToArray(_addresser$parts, 2),
      regionName = _addresser$parts2[0],
      parentStateName = _addresser$parts2[1];

  var multiple = (registry[parentStateName].multiples || []).includes(regionName);
  var activationRecord = activationRecords[hasAt ? name : stateName];
  var $el = activationRecord.instance.$el;


  if (hasAt) {
    focal = true;
  }

  if (!processed) {
    params.processed = new Set();
  }

  if (!startStateName) {
    startStateName = params.startStateName = name;
  }

  params.processed.add(cacheAddress);

  if (multiple && !detach) {
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
    var cacheAddress = viewConfigs.cacheAddress;

    if (!params.processed.has(cacheAddress)) {
      _instance2.default.deactivate(_lodash2.default.extend(params, { name: cacheAddress, focal: true, stateName: stateName }));
    }
  });

  _lodash2.default.each(stateConfigs.states, function (stateName) {
    return _instance2.default.deactivate({ name: stateName });
  });
};