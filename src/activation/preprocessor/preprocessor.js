import _                  from 'lodash';
import addresser          from '../../lib/addresser';
import error              from '../../lib/error';
import relations          from '../../lib/relations';
import vars               from '../../lib/vars';
import fullAddressMaker   from './lib/full-address-maker';
import resolvesNormalizer from './lib/resolves-normalizer';
import viewNormalizer     from './lib/view-normalizer';

let {activationSequences, registry} = vars.states;

export default stateParams => {
  let {stateName, dataParams, resolveDefinitions} = stateParams;
  
  !function preprocess(stateName, previousSequence) {
    let stateConfigs = registry[stateName];
    
    if(!stateConfigs) {
      error.throw(`state [${stateName}] has not been declared`, 'preprocessor');
    }
    
    let activationSequence = activationSequences[stateName] || (activationSequences[stateName] = []);
    
    if(!_.isEmpty(activationSequence)) {
      if(previousSequence) {
        previousSequence.splice(previousSequence.length, 0, ...activationSequence);
      }
      return;
    }
    
    let parentStateName = relations.parent(stateName);
    let resolveAddresses = stateConfigs.resolveAddresses = [];
    let mainViews = [];
    
    dataParams[stateName] = stateConfigs.data;
    
    if(stateConfigs.resolve) {
      resolveDefinitions[stateName] = resolvesNormalizer(stateConfigs, stateName);
      resolveAddresses.push(stateName);
    }
    
    if(relations.isRoot(stateName)) {
      return;
    }
    
    stateConfigs.viewsRegistry = {};
    
    if(stateConfigs.view && !stateConfigs.views) {
      stateConfigs.views = {};
      stateConfigs.main = true;
      stateConfigs.views[stateConfigs.parentRegion || 'main'] = _.pick(stateConfigs, ['view', 'main']);
    }
    
    _.each(stateConfigs.views, (viewConfigs, viewAddress) => {
      let viewAddressFull = fullAddressMaker(viewAddress, stateName);
      let [viewRegionName, viewStateName] = addresser.parts(viewAddressFull);
      let multiple = (registry[viewStateName].multiple || []).includes(viewRegionName);
      let viewAddressUnique = `${_.uniqueId('aptivator-id-')}@${stateName}`;
      let duplicateViewConfigs = (previousSequence || []).concat(activationSequence)
        .filter(viewConfigs => viewConfigs.viewAddressFull === viewAddressFull);
      let otherView = (duplicateViewConfigs[0] || {}).view;
      let viewConfigsExtension = {viewAddress, viewAddressFull, stateName, viewAddressUnique, multiple, viewRegionName, viewStateName};
      
      if(!multiple && otherView) {
        if(otherView === viewConfigs.view) {
          return;
        }
        
        error.throw(`two different views are trying to use [${viewAddressFull}] address`, 'preprocessor');
      }
      
      if(multiple) {
        for(let duplicateViewConfig of duplicateViewConfigs) {
          if(duplicateViewConfig.view === viewConfigs.view) {
            return;
          }
        }
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
        
        _.extend(stateConfigs, {viewAddressUnique});
      }
      
      if(viewConfigs.resolve) {
        resolveDefinitions[viewAddressUnique] = resolvesNormalizer(viewConfigs, viewAddressUnique);
        resolveAddresses.push(viewAddressUnique);
      }
      
      dataParams[viewAddressUnique] = viewConfigs.data;
      
      viewNormalizer(viewConfigs);
      stateConfigs.viewsRegistry[viewAddressUnique] = viewConfigs;
      activationSequence.push(_.extend(viewConfigs, viewConfigsExtension));

      if(viewConfigs.main) {
        preprocess(viewStateName, activationSequence);
      }
    });
    
    _.each(stateConfigs.states, stateName => preprocess(stateName, activationSequence));
    
    if(previousSequence) {
      preprocess(stateName, previousSequence);
    }
    
    activationSequence.sort((viewConfigs1, viewConfigs2) => 
      relations.parts(addresser.stateName(viewConfigs1.viewAddressUnique)).length >
      relations.parts(addresser.stateName(viewConfigs2.viewAddressUnique)).length);
  }(stateName);
  
  return stateParams;
};
