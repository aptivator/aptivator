import _         from 'lodash';
import addresser from '../../../lib/addresser';
import relations from '../../../lib/relations';
import vars      from '../../../lib/vars'; 

const [durationFlag, storeFlag, bothFlags] = [1, 2, 1 | 2];

export default (configs, entityName) => {
  let {resolves} = configs;
  let hasAt = entityName.includes('@');
  let stateName = hasAt ? addresser.stateName(entityName) : entityName;
  let family = relations.family(stateName).reverse();

  _.each(resolves, (resolveConfigs, resolveName) => {
    var status;
    
    if(_.isFunction(resolveConfigs)) {
      resolveConfigs = {resolver: resolveConfigs};
    }
  
    if(!_.isUndefined(resolveConfigs.duration)) {
      status |= durationFlag;
    }
    
    if(!_.isUndefined(resolveConfigs.store)) {
      status |= storeFlag;
    }

    !function normalizeResolves(index = 0, viewConfigs = hasAt && configs) {
      if(index >= family.length || status === bothFlags) {
        return;
      }
      
      let stateConfigs = viewConfigs;
      
      if(!stateConfigs) {
        stateConfigs = vars.states.registry[family[index++]];
      }
      
      if(stateConfigs.resolveConfigs) {
        if(!(status & durationFlag) && !_.isUndefined(stateConfigs.resolveConfigs.duration)) {
          resolveConfigs.duration = stateConfigs.resolveConfigs.duration;
          status |= durationFlag;
        }
        
        if(!(status & storeFlag) && !_.isUndefined(stateConfigs.resolveConfigs.store)) {
          resolveConfigs.store = stateConfigs.resolveConfigs.store;
          status |= storeFlag;
        }
      }
      
      normalizeResolves(index, null);
    }();
    
    resolves[resolveName] = resolveConfigs;
  });
  
  return resolves;
};
