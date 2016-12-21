import Backbone        from 'backbone';
import aptivator       from '../../../lib/instance';
import error           from '../../../lib/error';
import fragment        from '../../../lib/fragment';
import vars            from '../../../lib/vars';

export default err => {
  if(err) { 
    return error.throw(err);
  }
  
  let rootStateConfigs = vars.states.registry[vars.rootStateName];
  let {defaultStates} = rootStateConfigs;
  
  Backbone.history.start();
  
  if(!fragment.toState() && defaultStates) {
    defaultStates.forEach(stateName => 
      aptivator.activate({stateName, directParams: {running: true}}));
  }
};
