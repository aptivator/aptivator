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
        let uniqueValues = _.uniq(previousSequence.concat(activationSequence));
        previousSequence.splice(0, previousSequence.length, ...uniqueValues);
      }
      return;
    }
    
    if(stateConfigs.resolveAddresses) {
      return;
    }
    
    let resolveAddresses = stateConfigs.resolveAddresses = [];
    
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
      stateConfigs.views[stateConfigs.parentSelector || ''] = _.pick(stateConfigs, ['view', 'cache']);
    }
    
    let parentStateName = relations.parent(stateName);
    let viewCount = _.keys(stateConfigs.views).length;
    let mainViews = [];
    
    _.each(stateConfigs.views, (viewConfigs, viewAddress) => {
      if(viewConfigs.address) {
        viewAddress = viewConfigs.address;
      }
      
      let viewAddressFull = fullAddressMaker(viewAddress, stateName);
      let [viewSelector, viewStateName] = addresser.parts(viewAddressFull);
      let viewAddressUnique = `${_.uniqueId('aptivator-id-')}@${stateName}`;
      let duplicateViewConfigs = (previousSequence || []).concat(activationSequence)
        .filter(viewConfigs => viewConfigs.viewAddressFull === viewAddressFull);
      let otherView = (duplicateViewConfigs[0] || {}).view;
      
      if(otherView === viewConfigs.view) {
        console.log(viewAddressFull);
        return;
      }
      
      if(viewStateName !== parentStateName) {
        delete viewConfigs.main;
      }
      
      if(viewCount === 1) {
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
      _.extend(viewConfigs, {viewAddressFull, stateName, viewAddressUnique, viewSelector, viewStateName});
      activationSequence.push(viewConfigs);

      if(viewConfigs.main) {
        return preprocess(viewStateName, activationSequence);
      }
    });
    
    if(!mainViews.length) {
      error.throw(`main view should be specified for [${stateName}]`);
    }
    
    _.each(stateConfigs.states, parallelStateName => {
      preprocess(parallelStateName, activationSequence);
    });
    
    if(previousSequence) {
      preprocess(stateName, previousSequence);
    }
    
    activationSequence.sort((viewConfigs1, viewConfigs2) => 
      relations.parts(addresser.stateName(viewConfigs1.viewAddressUnique)).length >
      relations.parts(addresser.stateName(viewConfigs2.viewAddressUnique)).length);
  }(stateName);
  
  return stateParams;
};
