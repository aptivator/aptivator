import Backbone        from 'backbone';
import aptivator       from '../../../libs/instance';
import error           from '../../../libs/error';
import fragment        from '../../../libs/fragment';
import vars            from '../../../libs/vars';

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
