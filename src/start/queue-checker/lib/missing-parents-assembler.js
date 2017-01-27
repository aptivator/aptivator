import relations from '../../../lib/relations';

export default queue => {
  let missingParentsNames = [];
  let stateNames = queue.map(stateDefinition => stateDefinition[0]);
  
  stateNames.sort((...args) => 
    relations.parts(args[1]).length - relations.parts(args[0]).length);
  
  for(let [i, stateName] of stateNames.entries()) {
    if(relations.isRoot(stateName)) {
      continue;
    }
    
    let parentName = relations.parent(stateName);
    
    if(missingParentsNames.includes(parentName)) {
      continue;
    }
    
    if(!stateNames.includes(parentName, i + 1)) {
      missingParentsNames.push(parentName);
    }
  }
  
  return missingParentsNames.reverse().join(', ');
};
