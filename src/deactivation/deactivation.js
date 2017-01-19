import _             from 'lodash';
import addresser     from '../lib/addresser';
import aptivator     from '../lib/instance';
import hideClassName from '../lib/hide-class';
import relations     from '../lib/relations';
import vars          from '../lib/vars';

let {activationRecords, activationSequences, registry} = vars.states;

aptivator.deactivate = params => {
  let {name} = params;
  let activationSequence = activationSequences[name];

  _.each(activationSequence, viewConfigs => {
    let {viewAddressUnique, detachHidden} = viewConfigs;
    let activationRecord = activationRecords[viewAddressUnique];
    let {$el} = activationRecord.instance;
    
    if(detachHidden) {
      $el.removeClass(hideClassName).detach();
    } else {
      $el.addClass(hideClassName);
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