import relations from '../../../lib/relations';

export default queue => {
  let missingParents = [];
  let stateNames = queue.map(stateDefinition => stateDefinition[0]);
  
  stateNames.sort((stateName1, stateName2) => 
    stateName2.split('.').length - stateName1.split('.').length);
  
  for(let [i, stateName] of stateNames.entries()) {
    if(relations.isRoot(stateName)) {
      continue;
    }
    
    let parent = relations.parent(stateName);
    
    if(missingParents.includes(parent)) {
      continue;
    }
    
    if(!stateNames.includes(parent, i + 1)) {
      missingParents.push(parent);
    }
  }
  
  return missingParents.reverse().join(', ');
};
