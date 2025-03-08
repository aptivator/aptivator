import relations from '../../lib/relations';

export default queue => {
  let parentNames = [];
  let stateNames = queue.map(stateDefinition => stateDefinition[0]);
  
  stateNames.sort(relations.hierarchySorter(true));
  
  for(let [i, stateName] of stateNames.entries()) {
    let parentName = relations.parent(stateName);
    
    if(parentNames.includes(parentName)) {
      continue;
    }
    
    if(!stateNames.includes(parentName, i + 1)) {
      parentNames.push(parentName);
    }
  }
  
  return parentNames.reverse().join(', ');
};
