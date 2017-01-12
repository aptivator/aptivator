import _                  from 'lodash';
import addresser          from '../../lib/addresser';
import error              from '../../lib/error';
import relations          from '../../lib/relations';
import vars               from '../../lib/vars';
import fullAddressMaker   from './lib/full-address-maker';
import resolvesNormalizer from './lib/resolves-normalizer';
import viewNormalizer     from './lib/view-normalizer';

let {activationSequences} = vars.states;

export default stateParams => 
  new Promise(resolve => {
    let {stateName, dataParams, resolveDefinitions} = stateParams;
    
    !function preprocess(stateName, prevSequence) {
      let existingRecord = activationSequences[stateName];
      let {activationSequence} = existingRecord || (activationSequences[stateName] = {activationSequence: {}});
      
      if(existingRecord) {
        if(prevSequence) {
          _.extend(prevSequence, activationSequence);
        }
        return;
      }
      
      let parentStateName = relations.parent(stateName);
      let stateConfigs = vars.states.registry[stateName];
      let resolveAddresses = stateConfigs.resolveAddresses = [];
      let mainViews = [];
      
      if(!stateConfigs) {
        error.throw(`state [${stateName}] has not been declared`, 'preprocessor');
      }
      
      stateConfigs.viewsRegistry = {};
      
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
        stateConfigs.views[stateConfigs.parentRegion || 'main'] = _.pick(stateConfigs, ['view', 'main']);
      }
      
      _.each(stateConfigs.views, (viewConfigs, viewAddress) => {
        let viewAddressFull = fullAddressMaker(viewAddress, stateName);
        let viewStateName = addresser.stateName(viewAddressFull);
        let viewAddressUnique = `${_.uniqueId('aptivator-id-')}@${stateName}`;
        
        if(activationSequence[viewAddressFull] || prevSequence && prevSequence[viewAddressFull]) {
          error.throw(`view [${viewAddressFull}] already exists`, 'preprocessor');
        }
        
        if(viewStateName !== parentStateName) {
          delete viewConfigs.main;
        }
        
        if(viewAddress === 'main') {
          viewConfigs.main = true;
        }
        
        if(viewConfigs.main) {
          mainViews.push(viewAddress);
          
          if(mainViews.length > 1) {
            error.throw(`The following views [${mainViews.join(', ')}] are main for [${stateName}]`);
          }
          
          _.extend(stateConfigs, {viewAddressFull});
        }
        
        if(viewConfigs.resolve) {
          resolveDefinitions[viewAddressUnique] = resolvesNormalizer(viewConfigs, viewAddressUnique);
          resolveAddresses.push(viewAddressUnique);
        }
        
        dataParams[viewAddressUnique] = viewConfigs.data;
        
        activationSequence[viewAddressFull] = _.extend(viewConfigs, 
          {viewAddress, viewAddressFull, stateName, viewAddressUnique});
  
        viewNormalizer(viewConfigs);
  
        stateConfigs.viewsRegistry[viewAddressFull] = viewConfigs;
  
        if(viewConfigs.main) {
          preprocess(viewStateName, activationSequence);
        }
      });
      
      _.each(stateConfigs.states, stateName => preprocess(stateName, activationSequence));
      
      if(prevSequence) {
        _.extend(prevSequence, activationSequence);
      }
    }(stateName);
    
    resolve(stateParams);
  });
