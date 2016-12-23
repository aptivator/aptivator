import _                  from 'lodash';
import addresser          from '../../../lib/addresser';
import relations          from '../../../lib/relations';
import vars               from '../../../lib/vars';
import fullAddressMaker   from './lib/full-address-maker';
import resolvesNormalizer from './lib/resolves-normalizer';
import viewNormalizer     from './lib/view-normalizer';

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
    let resolveAddresses = stateConfigs.resolveAddresses = [];
    
    if(!stateConfigs) {
      callback(`state [${stateName}] has not been declared`);
    }
    
    dataParams[stateName] = stateConfigs.data;
    
    if(stateConfigs.resolve) {
      resolveDefinitions[stateName] = resolvesNormalizer(stateConfigs, stateName);
      resolveAddresses.push(stateName);
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
      let viewAddressFull = fullAddressMaker(viewAddress, stateName);
      let viewStateName = addresser.stateName(viewAddressFull);
      let viewAddressUnique = `${_.uniqueId('aptivator-id-')}@${stateName}`;
      
      if(activationSequence[viewAddressFull]) {
        callback(`view [${viewAddressFull}] already exists for [${activationSequence[viewAddressFull].stateName}] state`);
      }
      
      if(viewAddress === 'main') {
        stateConfigs.viewAddressFull = viewAddressFull;
        viewConfigs.main = true;
      }
      
      if(viewConfigs.resolve) {
        resolveDefinitions[viewAddressUnique] = resolvesNormalizer(viewConfigs, viewAddressUnique);
        resolveAddresses.push(viewAddressUnique);
      }
      
      dataParams[viewAddressUnique] = viewConfigs.data;
      
      activationSequence[viewAddressFull] = _.extend(viewConfigs, 
        {viewAddress, viewAddressFull, stateName, viewAddressUnique});

      viewNormalizer(viewConfigs);

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
