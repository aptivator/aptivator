import _         from 'lodash';
import relations from '../../../../libs/relations';
import vars      from '../../../../libs/vars'; 

export default (configs, stateName) => {
  let resolves = configs.resolve;
  let family = relations.family(stateName).reverse();

  _.each(resolves, (resolveConfigs, resolveName) => {
    _.isFunction(resolveConfigs) && (resolveConfigs = {resolver: resolveConfigs});
    
    if(_.isUndefined(resolveConfigs.persist)) {
      for(let relation of family) {
        let stateConfigs = vars.states.registry[relation];
        if(!_.isUndefined(stateConfigs.persistResolves)) {
          resolveConfigs.persist = stateConfigs.persistResolves;
          break;
        }
      }
    }
    
    if(_.isUndefined(configs.changingResolves) && !resolveConfigs.persist && resolveConfigs.store) {
      configs.changingResolves = true;
    }
    
    resolves[resolveName] = resolveConfigs;
  });
  
  return _.clone(resolves);
};
