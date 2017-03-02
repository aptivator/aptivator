import _                 from 'lodash';
import relations         from '../../lib/relations';
import vars              from '../../lib/vars';
import cacheAssessor     from './lib/cache-assessor';
import displayer         from './lib/displayer';
import instantiator      from './lib/instantiator';
import renderingPreparer from './lib/rendering-preparer';

let {rootStateName, states} = vars;
let {activationSequences} = states;

export default stateParams => {
  stateParams.flags.rendered = true;
  let {flags, beginningStateName} = stateParams;
  let {spliced} = flags;

  _.each(activationSequences[stateParams.stateName], viewConfigs => {
    if(!viewConfigs.record) {
      renderingPreparer(viewConfigs);
    }
    
    if(spliced && viewConfigs.record.active) {
      return;
    }
    
    let {main, stateName} = viewConfigs;
    
    if(main && _.isUndefined(beginningStateName)) {
      if(relations.isRoot(relations.parent(stateName))) {
        beginningStateName = rootStateName;
      } else {
        beginningStateName = stateName;
      }
      
      _.extend(stateParams, {beginningStateName});
    }
    
    if(cacheAssessor.total(viewConfigs, stateParams)) {
      return displayer(viewConfigs, stateParams, cacheAssessor);
    }
    
    instantiator(viewConfigs, stateParams);
  });

  return stateParams;
};
