import _         from 'lodash';
import relations from '../../../lib/relations';
import vars      from '../../../lib/vars';

let {rootStateName, states} = vars;
let {registry} = states;

export default function stateNamesCollector(stateNames) {
  stateNames = _.reduce(stateNames, (stateNames, stateName) => {
    let stateConfigs = registry[stateName];
    let {states} = stateConfigs;
    let family = relations.family(stateName);
    
    if(states) {
      stateNames.push(...stateNamesCollector(states));
    }
    
    stateNames.push(...family);
    return stateNames;
  }, []);
  
  stateNames = _.uniq(stateNames);
  stateNames = _.difference(stateNames, [rootStateName]);
  stateNames.sort(relations.hierarchySorter()).unshift(rootStateName);
  return stateNames;
}
