import _                   from 'lodash';
import paramsAssembler     from '../../lib/params-assembler';
import relations           from '../../lib/relations';
import entitiesTreeBuilder from './lib/entities-tree-builder';
import resolvesProcessor   from './lib/resolves-processor';

import {registry, resolveDefinitions, resolveParams} from '../../lib/vars';

export default stateParams => 
  new Promise((resolve, reject) => {
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
          let params = paramsAssembler(entityName, stateParams);
          let promise = resolvesProcessor(resolveDefinitions[entityName], resolveParams, entityName, params);
          promises.push(promise.then(() => process(node[entityName])).catch(reject));
        });
        Promise.all(promises).then(resolve).catch(reject);
      });
    }().then(() => resolve(stateParams)).catch(reject);
  });
