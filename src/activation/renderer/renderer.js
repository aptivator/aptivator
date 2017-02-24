import _                 from 'lodash';
import vars              from '../../lib/vars';
import canceler          from '../canceler/canceler';
import cacheAssessor     from './lib/cache-assessor';
import displayer         from './lib/displayer';
import instantiator      from './lib/instantiator';
import renderingPreparer from './lib/rendering-preparer';
import spliceAssessor    from './lib/splice-assessor';

let {activationSequences} = vars.states;

export default stateParams => {
  canceler(stateParams);
  stateParams.flags.rendered = true;

  _.each(activationSequences[stateParams.stateName], viewConfigs => {
    if(!viewConfigs.rendering) {
      renderingPreparer(viewConfigs);
    }
    
    if(spliceAssessor(viewConfigs, stateParams)) {
      return;
    }
    
    if(cacheAssessor.total(viewConfigs, stateParams)) {
      return displayer(viewConfigs, stateParams, cacheAssessor);
    }
    
    console.log(viewConfigs.fullAddress, cacheAssessor.explicit.cache, cacheAssessor.implicit.cache);
    
    instantiator(viewConfigs, stateParams);
  });

  return stateParams;
};
