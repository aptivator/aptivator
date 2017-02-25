import _         from 'lodash';
import relations from '../../../lib/relations';
import vars      from '../../../lib/vars';

let {rootStateName} = vars;

export default function stateNamesAggregator(stateNames) {
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
  stateNames = _.difference(stateNames, [rootStateName]);
  stateNames.sort(relations.hierarchySorter()).unshift(rootStateName);
  
  return stateNames;
}
