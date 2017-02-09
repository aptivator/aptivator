import _                    from 'lodash';
import approximator         from '../../lib/approximator';
import aptivator            from '../../lib/instance';
import fragment             from '../../lib/fragment';
import route_               from '../../lib/route';
import vars                 from '../../lib/vars';
import duplicatesRemover    from './duplicates-remover/duplicates-remover';
import transientInitializer from './transient-initializer/transient-initializer';

let {registry} = vars.states;
let eventHandle = 'aptivator-goto-preprocessor';

export default stateParams => 
  new Promise(resolve => {
    let {transient} = stateParams.flags;
    
    _.extend(stateParams.flags, {initialized: true});    
    
    aptivator.on(eventHandle, () => resolve(stateParams));
    
    let startingStates = aptivator.history.find({flags: {initialized: false}});
    
    if(startingStates.length) {
      return;
    }
    
    let triggerer = () => {
      aptivator.trigger(eventHandle);
      aptivator.off(eventHandle);
    };
    
    let query = {flags: {pending: true, initialized: true, preprocessed: false, canceled: false}};
    let startedStates = aptivator.history.find(query);
    let undeclaredStates = startedStates.filter(stateParams => {
      let {flags, stateName} = stateParams;
      if(!registry[stateName]) {
        return _.extend(flags, {canceled: true, pending: false, undeclared: true});
      }
    });

    if(transient) {
      return triggerer();
    }

    startedStates = _.difference(startedStates, undeclaredStates);
    startedStates = duplicatesRemover(startedStates);

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
    
    triggerer();
  });
