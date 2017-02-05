import _                      from 'lodash';
import approximator           from '../../lib/approximator';
import aptivator              from '../../lib/instance';
import fragment               from '../../lib/fragment';
import route_                 from '../../lib/route';
import vars                   from '../../lib/vars';
import serialStatesNormalizer from './serial-states-normalizer/serial-states-normalizer';
import transientInitializer   from './transient-initializer/transient-initializer';

let {registry} = vars.states;

export default stateParams => 
  new Promise(resolve => {
    let {transient} = stateParams.flags;
    
    _.extend(stateParams.flags, {active: false, pending: true});    
    
    aptivator.on('goto-preprocessor', () => resolve(stateParams));
    
    let startingStates = aptivator.history.get(stateParams => {
      let {active} = stateParams.flags;
      if(_.isUndefined(active)) {
        return true;
      }
    });
    
    if(startingStates.length) {
      return;
    }
    
    let startedStates = aptivator.history.get(stateParams => {
      let {active, pending, preprocessed, canceled} = stateParams.flags;
      
      if(active === false && pending && !preprocessed && !canceled) {
        return true;
      }
    });
    
    let undeclaredStates = startedStates.filter(stateParams => {
      let {flags, stateName} = stateParams;
      
      if(!registry[stateName]) {
        _.extend(flags, {active: false, canceled: true, pending: false, undeclared: true});
        return true;
      }
    });
    
    if(!transient) {
      startedStates = _.difference(startedStates, undeclaredStates);
      startedStates = serialStatesNormalizer(startedStates);
  
      var transientStates = aptivator.history.get(stateParams => {
        let {active, pending, canceled, transient} = stateParams.flags;
        if(transient && (active || pending) && !canceled) {
          return true;
        }
      }).reduce((o, stateParams) => (o[stateParams.stateName] = stateParams, o), {});
        
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
    }
    
    aptivator.trigger('goto-preprocessor');
    aptivator.off('goto-preprocessor');
  });
