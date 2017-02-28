import _ from 'lodash';

export default (states, stateName) => {
  let ancestorIndices = [];
  
  _.each(states, (stateConfigs, index) => {
    if(_.isString(stateConfigs)) {
      stateConfigs = {
        name: stateConfigs,
        route: true,
        direct: true
      };
    }
    
    if(stateName.includes(stateConfigs.name)) {
      return ancestorIndices.push(index);
    }
    
    if(!stateConfigs.flags) {
      stateConfigs.flags = {};
    }
    
    _.extend(stateConfigs.flags, {parallel: true});
    
    states.splice(index, 1, stateConfigs);
  });
  
  ancestorIndices.sort().reverse();
  
  _.each(ancestorIndices, index => {
    states.splice(index, 1);
  });
};
