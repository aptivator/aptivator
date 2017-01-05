import $         from 'jquery';
import _         from 'lodash';
import aptivator from '../../../lib/instance';
import fragment  from '../../../lib/fragment';
import vars      from '../../../lib/vars';

let {registry} = vars.states;

let findNearestStateName = hash => {
  if(!hash) {
    return;
  }
  
  for(let stateName in registry) {
    let stateConfigs = registry[stateName];
    
    if(!stateConfigs.route) {
      continue;
    }
    
    if(stateConfigs.routeRx.test(hash)) {
      return stateName;
    }
  }
  
  return findNearestStateName(hash.split('/').slice(0, -1).join('/'));
};

let determineErrorStateName = stateName => {
  if(!stateName || !vars.states.error.nested.length) {
    return vars.states.error.root[0];
  }
  
  let stateNameParts = stateName.split('.');
  let partsCount = 0;
  
  for(let errorStateName of vars.states.error.nested) {
    let errorStateNameParts = errorStateName.split('.');
    let intersection = _.intersection(stateNameParts, errorStateNameParts);
    if(intersection.length > partsCount) {
      stateName = errorStateName;
      partsCount = intersection.length;
    }
  }
  
  return partsCount ? stateName : determineErrorStateName();
};

let invalidRouteListener = evt => {
  if(fragment.toState()) {
    return;
  }
  
  let hash = fragment.get();
  
  console.log(hash);
  
  let stateName = findNearestStateName(hash);
  
  console.log(stateName);
  
  stateName = determineErrorStateName(stateName);
  
  console.log(stateName);
  
  if(!stateName) {
    return alert(`Provided route [${hash}] is invalid`);
  }
  
  aptivator.activate({stateName, directParams: {fragment: hash}});
};

export default callback => {
  $(() => {
    invalidRouteListener();
    setTimeout(() => $(window).on('hashchange', invalidRouteListener));
  }); 
  
  callback();
};
