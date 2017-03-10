import _         from 'lodash';
import relations from '../../../lib/relations';
import vars      from '../../../lib/vars';

let {rootStateName} = vars;

export default animationStates => {
  animationStates = _.reduce(animationStates, (animationStates, animationState) => {
    let {stateParams, stateName, beginningStateName, primary} = animationState;
    let family = relations.family(stateName);
    let beginningIndex = family.indexOf(beginningStateName);
    family = family.slice(beginningIndex);
    
    _.each(family, stateName => {
      let existingIndex = _.findIndex(animationStates, {stateName});
      
      if(existingIndex > -1) {
        if(primary) {
          animationStates.splice(existingIndex, 1);
        } else {
          return;
        }
      }
      
      animationStates.push({stateName, stateParams});
    });
    
    return animationStates;
  }, []);
  
  animationStates.sort(relations.hierarchySorter());
  
  let rootIndex = _.findIndex(animationStates, {stateName: rootStateName});
  
  if(rootIndex > -1) {
    let rootState = animationStates.splice(rootIndex, 1)[0];
    animationStates.unshift(rootState);
  }
  
  return animationStates;
};
