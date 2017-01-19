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
    activationSequences = _vars$states.activationSequences,
    registry = _vars$states.registry;


_instance2.default.deactivate = function (params) {
  var name = params.name;

  var activationSequence = activationSequences[name];

  _lodash2.default.each(activationSequence, function (viewConfigs) {
    var viewAddressUnique = viewConfigs.viewAddressUnique,
        detachHidden = viewConfigs.detachHidden;

    var activationRecord = activationRecords[viewAddressUnique];
    var $el = activationRecord.instance.$el;


    if (detachHidden) {
      $el.removeClass(_hideClass2.default).detach();
    } else {
      $el.addClass(_hideClass2.default);
    }

    activationRecord.detached = detachHidden;
    activationRecord.active = false;
  });
};

/*
aptivator.deactivate = params => {
  let {name, forward, focal, processed, detach, count} = params;
  let hasAt = name.includes('@');
  let stateName = hasAt ? addresser.stateName(name) : focal || forward ? name : relations.family(name).slice(1, 2)[0];
  let stateConfigs = registry[stateName];
  let {viewsRegistry} = stateConfigs;
  let viewAddressUnique = hasAt ? name : stateConfigs.viewAddressUnique;
  let {detachHidden} = viewsRegistry[viewAddressUnique];
  let activationRecord = activationRecords[viewAddressUnique];
  let {$el} = activationRecord.instance;

  if(!count) {
    count = 0;
  }
  
  if(++count > 100) {
    throw 'break recursion';
  }
  
  if(!processed) {
    params.processed = new Set();
  }
  
  params.processed.add(viewAddressUnique);
  
  if(detach) {
    detachHidden = true;
  }
  
  if(detachHidden) {
    $el.removeClass(hideClassName).detach();
  } else {
    $el.addClass(hideClassName);
  }
  
  activationRecord.detached = detachHidden;
  activationRecord.active = false;

  if(focal) {
    return;
  }
  
  _.each(activationRecord.regions, regionObj => {
    regionObj.current.forEach(viewAddressUnique => {
      if(params.processed.has(viewAddressUnique)) {
        return;
      }
      
      if(viewsRegistry[viewAddressUnique]) {
        params.processed.add(viewAddressUnique);
        return;
      }
      
      aptivator.deactivate({name: viewAddressUnique, forward: true, processed, count});
    });
  });
  
  _.each(viewsRegistry, viewConfigs => {
    let {viewAddressUnique} = viewConfigs;
    if(!params.processed.has(viewAddressUnique)) {
      aptivator.deactivate({name: viewAddressUnique, focal: true, stateName, processed, count});
    }
  });
  
  _.each(stateConfigs.states, stateName => aptivator.deactivate({name: stateName, processed, count}));
};
*/