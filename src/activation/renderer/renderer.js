import _                 from 'lodash';
import vars              from '../../lib/vars';
import canceler          from '../canceler/canceler';
import cacheAssessor     from './lib/cache-assessor';
import displayer         from './lib/displayer';
import instantiator      from './lib/instantiator';
import renderingPreparer from './lib/rendering-preparer';

let {activationSequences} = vars.states;

export default stateParams => {
  canceler(stateParams);
  stateParams.flags.rendered = true;
  let {augment} = stateParams.flags;

  _.each(activationSequences[stateParams.stateName], viewConfigs => {
    if(!viewConfigs.record) {
      renderingPreparer(viewConfigs);
    }
    
    if(augment && viewConfigs.record.active) {
      return;
    }
    
    if(cacheAssessor.total(viewConfigs, stateParams)) {
      return displayer(viewConfigs, stateParams, cacheAssessor);
    }
    
    instantiator(viewConfigs, stateParams);
  });

  return stateParams;
};
