import _             from 'lodash';
import addresser     from '../lib/addresser';
import aptivator     from '../lib/instance';
import hideClassName from '../lib/hide-class';
import relations     from '../lib/relations';
import vars          from '../lib/vars';

let {activationRecords, registry} = vars.states;

aptivator.deactivate = params => {
  let {name, forward, focal, processed, detach, ignoreMultiple} = params;
  let hasAt = name.includes('@');
  let stateName = hasAt ? addresser.stateName(name) : focal || forward ? name : relations.family(name).slice(1, 2)[0];
  let stateConfigs = registry[stateName];
  let viewAddressUnique = hasAt ? name : stateConfigs.viewAddressUnique;
  let {viewsRegistry} = stateConfigs;
  let {detachHidden, multiple} = viewsRegistry[viewAddressUnique];
  let activationRecord = activationRecords[viewAddressUnique];
  let {$el} = activationRecord.instance;
  
  if(hasAt) {
    focal = true;
  }
  
  if(!processed) {
    params.processed = new Set();
  }
  
  params.processed.add(viewAddressUnique);

  if(multiple && !ignoreMultiple) {
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
    let {viewAddressUnique} = viewConfigs;
    if(!params.processed.has(viewAddressUnique)) {
      aptivator.deactivate(_.extend(params, {name: viewAddressUnique, focal: true, stateName}));
    }
  });
  
  _.each(stateConfigs.states, stateName => aptivator.deactivate({name: stateName}));
};
