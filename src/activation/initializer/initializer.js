import _                    from 'lodash';
import approximator         from '../../lib/approximator';
import error                from '../../lib/error';
import fragment             from '../../lib/fragment';
import route                from '../../lib/route';
import vars                 from '../../lib/vars';
import dataStores           from './lib/data-stores';
import transientInitializer from './lib/transient-initializer';

export default stateParams => 
  new Promise(resolve => {
    let {direct: directParams, route: routeParams, name: stateName, routeValues, silent} = stateParams;
    let stateConfigs = vars.states.registry[stateName];
    
    delete stateParams.useResolves;
    
    if(vars.configs.showRuntime && !stateConfigs.transient) {
      stateParams.time = _.now();
    }
  
    if(!stateConfigs) {
      error.throw(`invalid [${stateName}] state name`, 'initializer');
    }
    
    if(_.isObject(stateConfigs.transient)) {
      _.extend(stateParams, _.pick(stateConfigs.transient, ['noResolves']));
    }
    
    let transientStateName = approximator.fromStateName('transient', stateName);
    
    if(transientStateName && transientStateName !== stateName) {
      stateParams.transient = transientInitializer(transientStateName);
    }
  
    if(!routeValues) {
      routeValues = stateConfigs.routeValues;
    }
  
    if(!stateConfigs.route) {
      silent = true;
    }
    
    if(!routeParams || _.isEmpty(routeParams)) {
      stateParams.routeParams = route.parts.assemble(stateName, routeValues);
      
      if(!silent) {
        fragment.set(stateParams.routeParams.fragment);
      }
    }
    
    _.extend(stateParams, dataStores, {directParams, routeParams, stateName});
    
    resolve(stateParams);
  });
