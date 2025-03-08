import _                        from 'lodash';
import aptivator                from '../lib/aptivator';
import error_                   from '../lib/error';
import relations                from '../lib/relations';
import otherStateRegistrar      from './lib/other-state-registrar';
import parallelStatesNormalizer from './lib/parallel-states-normalizer';
import rootStateConfigurator    from './lib/root-state-configurator';
import routeConfigurator        from './route-configurator/route-configurator';

import {errorRegistry, queue, registry, transientRegistry} from '../lib/vars';

aptivator.state = (stateName, stateConfigs) => {
  try {
    if(registry[stateName]) {
      error_.throw(`state [${stateName}] has already been declared`, 'state declaration');
    }
    
    _.extend(stateConfigs, {stateName});
    
    if(relations.isRoot(stateName)) {
      rootStateConfigurator(stateConfigs);
    }
  
    let {transient, error, on, once, states: parallelStates, substates, route, root} = stateConfigs;
    let parentStateName = root || relations.parent(stateName);
    let parentConfigs = root ? {} : registry[parentStateName];    
    let eventMethods = {};
    
    if(!parentConfigs) {
      return queue.push([stateName, stateConfigs]);
    }
    
    let {template, view, views} = stateConfigs;
    
    if(!(template || view || views)) {
      stateConfigs.abstract = true;
    }
    
    if(transient || error) {
      otherStateRegistrar(stateName, transient ? transientRegistry : errorRegistry);
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
      parallelStatesNormalizer(parallelStates, stateName);
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
  } catch(e) {
    error_.errorer(e);
  }
};
