import Backbone        from 'backbone';
import aptivator       from '../../../lib/instance';
import fragment        from '../../../lib/fragment';
import vars            from '../../../lib/vars';

export default e => {
  if(e) { 
    return console.error(e);
  }
  
  let rootStateConfigs = vars.states.registry[vars.rootStateName];
  let {defaultStates} = rootStateConfigs;
  
  Backbone.history.start();
  
  if(!fragment.get() && defaultStates) {
    defaultStates.forEach(stateName => 
      aptivator.activate({stateName, directParams: {running: true}}));
  }
};
