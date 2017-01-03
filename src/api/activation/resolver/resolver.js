import _                   from 'lodash';
import addresser           from '../../../lib/addresser';
import params              from '../../../lib/params';
import relations           from '../../../lib/relations';
import vars                from '../../../lib/vars';
import entitiesTreeBuilder from './lib/entities-tree-builder';
import resolvesProcessor   from './lib/resolves-processor';

export default (callback, stateParams) => {
  let {stateName, resolveParams, resolveDefinitions} = stateParams;
  let resolveAddresses = relations.family(stateName).reduce((resolveAddresses, relation) => 
    resolveAddresses.concat(vars.states.registry[relation].resolveAddresses), []);
  let tree = entitiesTreeBuilder(resolveAddresses);

  function processResolves(node = tree) {
    return new Promise((resolve, reject) => {
      let promises = [];
      _.keys(node).forEach(entityName => {
        let hasAt = entityName.includes('@');
        let stateName = hasAt ? addresser.stateName(entityName): entityName;
        let family = relations.family(stateName).concat(hasAt ? entityName : []);
        let resolverParams = params.assemble(family, stateParams);
        let promise = resolvesProcessor(resolveDefinitions[entityName], resolveParams, entityName, resolverParams);
        promises.push(promise.then(() => processResolves(node[entityName])).catch(reject));
      });
      Promise.all(promises).then(resolve).catch(reject);
    });
  }
  
  try {
    processResolves().then(() => callback()).catch(callback);
  } catch(e) {
    callback(e);
  }
};
