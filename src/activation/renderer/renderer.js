import _                 from 'lodash';
import relations         from '../../lib/relations';
import cacheAssessor     from './lib/cache-assessor';
import displayer         from './lib/displayer';
import instantiator      from './lib/instantiator';
import renderingPreparer from './lib/rendering-preparer';

import {rootStateName, registry} from '../../lib/vars';

export default stateParams => {
  stateParams.flags.rendered = true;
  let {flags, beginningStateName, stateName} = stateParams;
  let {spliced} = flags;
  let family = relations.family(stateName).slice(1);

  _.each(family, stateName =>{
    _.each(registry[stateName].views, viewConfigs => {
      let {record = {}, main, stateName} = viewConfigs;
      let {ui, active} = record;
      
      if(_.isEmpty(record)) {
        renderingPreparer(viewConfigs);
      }
      
      if(spliced && active) {
        return;
      }
      
      if(main && _.isUndefined(beginningStateName)) {
        if(relations.isRoot(relations.parent(stateName))) {
          beginningStateName = rootStateName;
        } else {
          beginningStateName = stateName;
        }
        
        _.extend(stateParams, {beginningStateName});
      }
      
      if(cacheAssessor.total(viewConfigs, stateParams)) {
        if(ui) {
          displayer(viewConfigs, stateParams, cacheAssessor);
        }
        
        return;
      }
      
      instantiator(viewConfigs, stateParams);      
    });
  });

  return stateParams;
};
