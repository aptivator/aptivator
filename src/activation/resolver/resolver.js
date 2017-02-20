import _                   from 'lodash';
import addresser           from '../../lib/addresser';
import params              from '../../lib/params';
import relations           from '../../lib/relations';
import vars                from '../../lib/vars';
import canceler            from '../canceler/canceler';
import entitiesTreeBuilder from './lib/entities-tree-builder';
import resolvesProcessor   from './lib/resolves-processor';

let {resolveDefinitions, resolveParams, states} = vars;
let {registry} = states;

export default stateParams => {
  canceler(stateParams);
  
  return new Promise((resolve, reject) => {
    stateParams.flags.resolved = true;
    
    if(stateParams.flags.noResolves) {
      return resolve(stateParams);
    }
    
    let {stateName} = stateParams;
    let resolveAddresses = relations.family(stateName).reduce((resolveAddresses, relation) => 
      resolveAddresses.concat(registry[relation].resolveAddresses), []);
    let tree = entitiesTreeBuilder(resolveAddresses);
  
    !function process(node = tree) {
      return new Promise((resolve, reject) => {
        let promises = [];
        _.keys(node).forEach(entityName => {
          let stateName = addresser.stateName(entityName);
          let family = relations.family(stateName);
          let resolverParams = params.assemble(family, stateParams);
          let promise = resolvesProcessor(resolveDefinitions[entityName], resolveParams, entityName, resolverParams);
          promises.push(promise.then(() => process(node[entityName])).catch(reject));
        });
        Promise.all(promises).then(resolve).catch(reject);
      });
    }().then(() => resolve(stateParams)).catch(reject);
  });
};
