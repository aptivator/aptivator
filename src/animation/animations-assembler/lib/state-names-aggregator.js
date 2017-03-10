import _         from 'lodash';
import relations from '../../../lib/relations';
import vars      from '../../../lib/vars';

let {rootStateName} = vars;

export default stateNames => {
  stateNames = _.reduce(stateNames, (stateNames, stateNameArr) => {
    if(!_.isArray(stateNameArr)) {
      stateNameArr = [rootStateName, stateNameArr];
    }
  
    let [min, stateName] = stateNameArr;
    let family = relations.family(stateName);
    let minIndex = family.indexOf(min);
    
    family = family.slice(minIndex);
    stateNames.push(...family);
    return stateNames;
  }, []);
  
  stateNames = _.uniq(stateNames);
  
  stateNames.sort(relations.hierarchySorter());
  
  if(stateNames.includes(rootStateName)) {
    stateNames = _.difference(stateNames, [rootStateName]);
    stateNames.unshift(rootStateName);
  }
  
  return stateNames;
};
