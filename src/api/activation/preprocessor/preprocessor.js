import _                  from 'lodash';
import addresser          from '../../../libs/addresser';
import relations          from '../../../libs/relations';
import vars               from '../../../libs/vars';
import resolvesNormalizer from './libs/resolves-normalizer';

export default (callback, stateParams) => {
  let {stateName, activationSequences, dataParams, resolveDefinitions} = stateParams;
  
  !function preprocess(stateName, prevSequence) {
    let existingRecord = activationSequences[stateName];
    let {activationSequence} = existingRecord || (activationSequences[stateName] = {activationSequence: {}});
    
    if(existingRecord) {
      if(prevSequence) {
        _.extend(prevSequence, activationSequence);
      }
      return;
    }
    
    let stateConfigs = vars.states.registry[stateName];
    
    if(!stateConfigs) {
      callback(`state [${stateName}] has not been declared`);
    }
    
    dataParams[stateName] = stateConfigs.data;
    
    if(stateConfigs.resolve) {
      resolveDefinitions[stateName] = resolvesNormalizer(stateConfigs, stateName);
    }
    
    if(relations.isRoot(stateName)) {
      return;
    }
    
    if(stateConfigs.view && !stateConfigs.views) {
      stateConfigs.views = {};
      stateConfigs.main = true;
      stateConfigs.views[stateConfigs.parentRegion || 'main'] = _.pick(stateConfigs, ['view']);
    }
    
    _.each(stateConfigs.views, (viewConfigs, viewAddress) => {
      console.log(viewAddress);
      let viewAddressFull = addresser.full(viewAddress, stateName);
      let viewStateName = addresser.stateName(viewAddressFull);
      let viewAddressUnique = viewConfigs.main ? `${stateName}@${viewStateName}` : viewAddressFull;
      
      if(activationSequence[viewAddressFull]) {
        callback(`view [${viewAddressFull}] already exists for [${activationSequence[viewAddressFull].stateName}] state`);
      }
      
      if(viewAddress === 'main') {
        stateConfigs.viewAddressFull = viewAddressFull;
        viewConfigs.main = true;
      }
      
      if(viewConfigs.resolve) {
        resolveDefinitions[viewAddressUnique] = resolvesNormalizer(viewConfigs, stateName);
      }
      
      dataParams[viewAddressUnique] = viewConfigs.data;
      
      activationSequence[viewAddressFull] = _.extend(viewConfigs, 
        {viewAddress, viewAddressFull, stateName, viewAddressUnique});

      if(viewConfigs.main) {
        preprocess(viewStateName, activationSequence);
      }
    });
    
    if(prevSequence) {
      _.extend(prevSequence, activationSequence);
    }
  }(stateName);

  callback();
};
