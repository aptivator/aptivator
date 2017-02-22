import _         from 'lodash';
import relations from '../../../lib/relations';
import vars      from '../../../lib/vars';

let {rootStateName, states} = vars;
let {registry} = states;

export default function stateNamesAggregator(stateNames) {
  stateNames = _.reduce(stateNames, (stateNames, stateNameArr) => {
    if(!_.isArray(stateNameArr)) {
      stateNameArr = [rootStateName, stateNameArr];
    }
  
    let [min, stateName] = stateNameArr;
    let stateConfigs = registry[stateName];
    let {states} = stateConfigs;
    let family = relations.family(stateName);
    let minIndex = family.indexOf(min);
    
    family = family.slice(minIndex);
    
    if(states) {
      stateNames.push(...stateNamesAggregator(states));
    }
    
    stateNames.push(...family);
    return stateNames;
  }, []);
  
  stateNames = _.uniq(stateNames);
  stateNames = _.difference(stateNames, [rootStateName]);
  stateNames.sort(relations.hierarchySorter()).unshift(rootStateName);
  
  return stateNames;
}
