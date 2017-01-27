import _                    from 'lodash';
import approximator         from '../../lib/approximator';
import aptivator            from '../../lib/instance';
import error                from '../../lib/error';
import fragment_            from '../../lib/fragment';
import route                from '../../lib/route';
import vars                 from '../../lib/vars';
import transientInitializer from './lib/transient-initializer';

let {states} = vars;
let {pending, registry} = states;

export default async stateParams => {
  let {ignorePending, routeParams, routeValues, silent, stateName} = stateParams;
  let stateConfigs = registry[stateName];
  
  if(!stateConfigs) {
    error.throw(`invalid [${stateName}] state name`, 'initializer');
  }
  
  delete stateParams.noResolves;
  
  let {transient} = stateConfigs;
  let isTransient = !!transient;
  
  if(vars.configs.showRuntime && !transient) {
    stateParams.time = _.now();
  }
  
  if(!ignorePending) {
    pending.forEach(stateParams => {
      let {stateName} = stateParams;
      stateParams.abort = true;
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
  
  if(stateConfigs.route && !routeParams) {
    if(!routeValues) {
      routeValues = stateConfigs.routeValues;
    }
    
    routeParams = route.parts.assemble(stateName, routeValues);
    
    if(!silent) {
      fragment_.set(routeParams.fragment);
    }
  }
  
  _.extend(stateParams, {isTransient, routeParams});
  
  pending.add(stateParams);

  return stateParams;
};
