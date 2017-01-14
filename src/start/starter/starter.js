import _               from 'lodash';
import Backbone        from 'backbone';
import aptivator       from '../../lib/instance';
import fragment        from '../../lib/fragment';
import vars            from '../../lib/vars';

export default () => 
  new Promise(resolve => {
    let rootStateConfigs = vars.states.registry[vars.rootStateName];
    let {defaultState} = rootStateConfigs;
    
    Backbone.history.start();
    
    if(!fragment.get() && defaultState) {
      aptivator.activate({name: defaultState, direct: {running: true}}).catch(_.noop);
    }
    
    resolve();
  });
