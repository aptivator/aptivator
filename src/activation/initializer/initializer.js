import _                    from 'lodash';
import approximator         from '../../lib/approximator';
import aptivator            from '../../lib/instance';
import error                from '../../lib/error';
import fragment             from '../../lib/fragment';
import route_               from '../../lib/route';
import vars                 from '../../lib/vars';
import transientInitializer from './lib/transient-initializer';

let {states} = vars;
let {pending, registry} = states;

export default stateParams => {
  let {ignorePending, route, routeValues, silent, stateName} = stateParams;
  let stateConfigs = registry[stateName];
  
  if(!stateConfigs) {
    error.throw(`invalid [${stateName}] state name`, 'initializer');
  }
  
  delete stateParams.noResolves;
  
  let {transient} = stateConfigs;
  
  stateParams.isTransient = !!transient;
  
  if(vars.configs.showRuntime && !transient) {
    stateParams.time = _.now();
  }
  
  if(!ignorePending) {
    pending.forEach(stateParams => {
      let {stateName} = stateParams;
      stateParams.cancel = true;
      aptivator.deactivate({name: stateName});
    });
    
    if(states.activeTransient) {
      aptivator.deactivate({name: states.activeTransient});
    }
  }
  
  if(!transient) {
    let transientStateName = approximator.fromStateName('transient', stateName);
    if(transientStateName) {
      stateParams.transient = transientInitializer(transientStateName);
    }
  }
  
  if(_.isObject(transient)) {
    _.extend(stateParams, _.pick(transient, ['noResolves']));
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

  pending.add(stateParams);

  return stateParams;
};
