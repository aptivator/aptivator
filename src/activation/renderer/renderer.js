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
  let {flags, beginningStateName, stateName} = stateParams;
  let {spliced} = flags;
  let family = relations.family(stateName).slice(1);

  _.each(family, stateName =>{
    _.each(activationSequences[stateName], viewConfigs => {
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
