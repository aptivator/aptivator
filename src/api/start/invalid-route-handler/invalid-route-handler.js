import $         from 'jquery';
import _         from 'lodash';
import aptivator from '../../../lib/instance';
import fragment  from '../../../lib/fragment';
import relations from '../../../lib/relations';
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

let determineOtherStateName = (stateName, registeredStateNames) => {
  if(!stateName) {
    return registeredStateNames.root;
  }
  
  let stateNameParts = relations.parts(stateName);
  let max = 0;
  
  registeredStateNames.forEach(errorStateName => {
    let intersection = _.intersection(stateNameParts, relations.parts(errorStateName));
    if(intersection.length > max) {
      stateName = errorStateName;
      max = intersection.length;
    }
  });

  return max ? stateName : determineOtherStateName(null, registeredStateNames);
};

let invalidRouteListener = () => {
  if(fragment.toState()) {
    return;
  }
  
  let hash = fragment.get();
  let stateName = findNearestStateName(hash);
  stateName = determineOtherStateName(stateName, vars.states.error);
  
  if(!stateName) {
    return alert(`Provided route [${hash}] is invalid`);
  }
  
  aptivator.activate({stateName, direct: {fragment: hash}});
};

export default () => 
  new Promise(resolve => {
    $(() => {
      invalidRouteListener();
      setTimeout(() => $(window).on('hashchange', invalidRouteListener));
    });
    
    resolve();
  });
