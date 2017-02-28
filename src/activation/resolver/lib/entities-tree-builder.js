import addresser from '../../../lib/addresser';
import relations from '../../../lib/relations';

export default (entityNames, tree = {}) => 
  entityNames.reduce((tree, entityName) => {
    let hasAt = entityName.includes('@');
    let stateName = addresser.stateName(entityName);
    let family = relations.family(stateName);
    let current = tree;
    
    family.reduce((tree, relation) => {
      if(entityNames.includes(relation)) {
        current = current[relation] || (current[relation] = {});
      }
      return tree;
    }, tree);
    
    if(hasAt) {
      current[entityName] = null;
    }
    
    return tree;
  }, tree);
