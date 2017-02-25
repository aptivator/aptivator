import _                        from 'lodash';
import aptivator                from '../lib/instance';
import error_                   from '../lib/error';
import relations                from '../lib/relations';
import vars                     from '../lib/vars';
import otherStateRegistrar      from './lib/other-state-registrar';
import parallelStatesNormalizer from './lib/parallel-states-normalizer';
import rootStateConfigurator    from './lib/root-state-configurator';
import routeConfigurator        from './lib/route-configurator';

let {states} = vars;
let {registry, queue} = states;

aptivator.state = (stateName, stateConfigs) => 
  !async function() {
    if(registry[stateName]) {
      error_.throw(`state [${stateName}] has already been declared`, 'state declaration');
    }
    
    if(relations.isRoot(stateName)) {
      stateConfigs = rootStateConfigurator(stateName, stateConfigs);
    }
    
    _.extend(stateConfigs, {stateName});
    
    let {transient, error, on, once, states: parallelStates, substates, route, root} = stateConfigs;
    let parentStateName = root || relations.parent(stateName);
    let parentConfigs = root ? {} : registry[parentStateName];    
    let eventMethods = {};
    
    if(!parentConfigs) {
      return queue.push([stateName, stateConfigs]);
    }
    
    if(transient || error) {
      otherStateRegistrar(stateName, states[transient ? 'transient' : 'error']);
      delete stateConfigs.route;
    }
    
    if(on) {
      _.extend(eventMethods, {on});
    }
    
    if(once) {
      _.extend(eventMethods, {once});
    }
    
    _.each(eventMethods, (eventsConfigs, eventMethod) => {
      aptivator[eventMethod](_.mapValues(eventsConfigs, eventConfigs => {
        return {[stateName]: eventConfigs};
      }));
    });
    
    if(parallelStates) {
      parallelStatesNormalizer(parallelStates);
    }
    
    if(route) {
      routeConfigurator(stateConfigs, parentConfigs);
    }
  
    registry[stateName] = stateConfigs;
  
    _.each(substates, (stateConfigs, subStateName) => {
      aptivator.state(`${stateName}.${subStateName}`, stateConfigs);
    });
  
    if(queue.length) {
      aptivator.state(...queue.pop());
    }
  }().catch(error_.errorer);
