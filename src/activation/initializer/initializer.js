import _                    from 'lodash';
import approximator         from '../../lib/approximator';
import aptivator            from '../../lib/instance';
import error                from '../../lib/error';
import fragment             from '../../lib/fragment';
import route_               from '../../lib/route';
import vars                 from '../../lib/vars';
import transientInitializer from './transient-initializer/transient-initializer';

let {registry} = vars.states;

export default stateParams => {
  if(!stateParams.flags) {
    stateParams.flags = {};
  }
  
  let {flags, route, routeValues, stateName} = stateParams;
  let {parallel, silent, transient} = flags;
  let stateConfigs = registry[stateName];
  
  if(!stateConfigs) {
    error.throw(`invalid [${stateName}] state name`, 'initializer');
  }
  
  stateParams.hooks = {};
  
  _.extend(stateParams.flags, {active: false, pending: true});
  
  if(vars.configs.showRuntime && !transient) {
    stateParams.time = _.now();
  }
  
  if(!transient) {
    let transientStateName = approximator.fromStateName('transient', stateName);
    
    if(transientStateName) {
      let transientStateParams = aptivator.history.getOne(stateParams => {
        let {stateName, flags} = stateParams;
        let {active, pending} = flags;
        
        if(stateName === transientStateName && (active || pending)) {
          return true;
        }
      });

      if(transientStateParams) {
        let {owners, currentOwners} = transientStateParams;
        let ownerStateParams = owners[owners.length - 1];
        let {transientConfigs} = ownerStateParams;
        
        _.extend(stateParams, {transientConfigs});
        owners.push(stateParams);
        currentOwners.add(stateParams);
      } else {
        stateParams.transientConfigs = transientInitializer(transientStateName, stateParams);
      }
    }
  }
  
  if(!(parallel || transient)) {
    let pending = aptivator.history.get(stateParams => {
      let {stateName: stateNameInner, flags} = stateParams;
      let {pending, parallel, transient} = flags;

      if(!parallel && pending && !transient && stateNameInner !== stateName) {
        return true;
      }
    });
    
    pending.forEach(stateParams => stateParams.flags.canceled = true);
  }
  
  if(stateConfigs.route && !route) {
    if(!routeValues) {
      routeValues = stateConfigs.routeValues;
    }
    
    route = route_.parts.assemble(stateName, routeValues);
    
    if(!silent) {
      fragment.set(route.fragment);
    }
    
    _.extend(stateParams, {route});
  }

  return stateParams;
};
