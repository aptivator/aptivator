import error     from '../../../lib/error';
import relations from '../../../lib/relations';

export default (stateName, registeredStateNames) => {
  let parentStateName = relations.parent(stateName);
  
  registeredStateNames.forEach(registeredStateName => {
    if(relations.parent(registeredStateName) === parentStateName) {
      error.throw(`already registered [${registeredStateName}] under [${parentStateName}]`, 'state declaration');
    }
  });
  
  if(relations.isRoot(relations.parent(stateName))) {
    registeredStateNames.root = stateName;
  }
  
  registeredStateNames.push(stateName);  
};
