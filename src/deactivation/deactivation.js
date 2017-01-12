import _             from 'lodash';
import addresser     from '../lib/addresser';
import aptivator     from '../lib/instance';
import hideClassName from '../lib/hide-class';
import relations     from '../lib/relations';
import vars          from '../lib/vars';

let {activationRecords, registry} = vars.states;

aptivator.deactivate = params => {
  let {name, forward, focal, processed, startStateName, stateName, detach} = params;
  let hasAt = name.includes('@');
  stateName = stateName ? stateName : hasAt ? addresser.stateName(name) : 
    focal || forward ? name : relations.family(name).slice(1, 2)[0];
  let stateConfigs = registry[stateName];
  let {viewsRegistry} = stateConfigs;
  let viewConfigs = viewsRegistry[hasAt ? name : stateConfigs.viewAddressFull];
  let {detachHidden, viewAddressFull, cacheAddress} = viewConfigs;
  let [regionName, parentStateName] = addresser.parts(viewAddressFull);
  let multiple = (registry[parentStateName].multiples || []).includes(regionName);
  let activationRecord = activationRecords[hasAt ? name : stateName];
  let {$el} = activationRecord.instance;
  
  if(hasAt) {
    focal = true;
  }
  
  if(!processed) {
    params.processed = new Set();
  }
  
  if(!startStateName) {
    startStateName = params.startStateName = name;
  }
  
  params.processed.add(cacheAddress);
  
  if(multiple && !detach) {
    return;
  }

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
    regionObj.current.forEach(name => { 
      if(name.includes('@')) {
        params.processed.add(name);
        return;
      }
      
      aptivator.deactivate(_.extend(params, {name, forward: true}));
    });
  });
  
  _.each(viewsRegistry, viewConfigs => {
    let {cacheAddress} = viewConfigs;
    if(!params.processed.has(cacheAddress)) {
      aptivator.deactivate(_.extend(params, {name: cacheAddress, focal: true, stateName}));
    }
  });
  
  _.each(stateConfigs.states, stateName => aptivator.deactivate({name: stateName}));
};
