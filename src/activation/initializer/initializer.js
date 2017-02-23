import _                    from 'lodash';
import approximator         from '../../lib/approximator';
import aptivator            from '../../lib/instance';
import fragment             from '../../lib/fragment';
import route_               from '../../lib/route';
import vars                 from '../../lib/vars';
import canceler             from '../canceler/canceler';
import duplicatesRemover    from './lib/duplicates-remover';
import transientInitializer from './lib/transient-initializer';

let {registry} = vars.states;
let eventHandle = 'aptivator-goto-preprocessor';

export default stateParams => {
  canceler(stateParams);
  
  return new Promise(async resolve => {
    let {transient} = stateParams.flags;
    
    _.extend(stateParams.flags, {initialized: true});    
    
    if(transient) {
      return resolve(stateParams);
    }
    
    aptivator.once(eventHandle, () => resolve(stateParams));
    
    let startingStates = aptivator.history.find({flags: {initialized: false}});
    
    if(startingStates.length) {
      return;
    }

    let query = {flags: {pending: true, initialized: true, preprocessed: false, canceled: false}};
    let startedStates = aptivator.history.find(query);
    
    startedStates = await duplicatesRemover(startedStates);

    let transientStates = aptivator.history.find(stateParams => {
      let {active, pending, canceled, transient} = stateParams.flags;
      if(transient && (active || pending) && !canceled) {
        return true;
      }
    });
    
    transientStates = transientStates.reduce((o, stateParams) => {
      o[stateParams.stateName] = stateParams;
      return o;
    }, {});
      
    startedStates.forEach(stateParams => {
      let {flags, route, routeValues, stateName} = stateParams;
      let {parallel, silent} = flags;
      let stateConfigs = registry[stateName];
      let transientStateName = approximator.fromStateName('transient', stateName);
      
      if(transientStateName) {
        let transientStateParams = transientStates[transientStateName];
        if(!transientStateParams) {
          transientStateParams = transientInitializer(transientStateName);
          transientStates[transientStateName] = transientStateParams;
        }
        
        transientStateParams.owners.add(stateParams);
        _.extend(stateParams, {transientStateParams});
      }
      
      if(stateConfigs.route && !route) {
        if(!routeValues) {
          routeValues = stateConfigs.routeValues;
        }
        
        route = route_.parts.assemble(stateName, routeValues);
        
        if(!(silent || parallel)) {
          fragment.set(route.fragment);
        }
        
        _.extend(stateParams, {route});
      }
    });

    if(vars.configs.showRuntime) {
      stateParams.time = _.now();
    }
    
    aptivator.trigger(eventHandle);
  });
};
