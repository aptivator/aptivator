import _ from 'lodash';

export default states => 
  _.each(states, (stateConfigs, index) => {
    if(_.isString(stateConfigs)) {
      stateConfigs = {
        name: stateConfigs,
        route: true,
        direct: true
      };
    }
    
    if(!stateConfigs.flags) {
      stateConfigs.flags = {};
    }
    
    _.extend(stateConfigs.flags, {parallel: true});
    
    states.splice(index, 1, stateConfigs);
  });
