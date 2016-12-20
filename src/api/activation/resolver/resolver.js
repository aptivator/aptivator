import _                 from 'lodash';
import addresser         from '../../../libs/addresser';
import params            from '../../../libs/params';
import relations         from '../../../libs/relations';
import resolvesProcessor from './libs/resolves-processor';
import statesTreeBuilder from './libs/states-tree-builder';

export default (callback, stateParams) => {
  let {resolveParams, resolveDefinitions} = stateParams;
  let tree = statesTreeBuilder(_.keys(resolveDefinitions));

  !function processResolves(node = tree) {
    return new Promise((resolve, reject) => {
      let promises = [];
      _.keys(node).forEach(entityName => {
        let hasAt = entityName.includes('@');
        let stateName = hasAt ? addresser.region(entityName): entityName;
        let family = relations.family(stateName).concat(hasAt ? entityName : []);
        let resolverParams = params.assemble(family, stateParams);
        let promise = resolvesProcessor(resolveDefinitions[entityName], resolveParams, entityName, resolverParams);
        promises.push(promise.then(() => processResolves(node[entityName])).catch(reject));
      });
      Promise.all(promises).then(resolve).catch(reject);
    });
  }().then(() => callback()).catch(callback);
};
