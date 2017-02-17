import _                    from 'lodash';
import addresser            from '../../lib/addresser';
import error                from '../../lib/error';
import relations            from '../../lib/relations';
import vars                 from '../../lib/vars';
import animationsNormalizer from './lib/animations-normalizer';
import fullAddressMaker     from './lib/full-address-maker';
import resolvesNormalizer   from './lib/resolves-normalizer';
import viewNormalizer       from './lib/view-normalizer';

let {dataParams, resolveDefinitions, states} = vars;
let {activationSequences, registry} = states;

export default stateParams => {
  let {stateName} = stateParams;
  
  stateParams.flags.preprocessed = true;
  
  !function preprocess(stateName, previousSequence) {
    let stateConfigs = registry[stateName];

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
    
    if(stateConfigs.data) {
      dataParams[stateName] = stateConfigs.data;
    }
    
    if(stateConfigs.resolves) {
      resolveDefinitions[stateName] = resolvesNormalizer(stateConfigs, stateName);
      resolveAddresses.push(stateName);
    }
    
    if(relations.isRoot(stateName)) {
      return;
    }
    
    let viewsRegistry = stateConfigs.viewsRegistry = {};
    
    if(stateConfigs.view && !stateConfigs.views) {
      stateConfigs.views = {};
      stateConfigs.main = true;
      stateConfigs.views[stateConfigs.parentSelector || ''] = _.pick(stateConfigs, ['view', 'cache']);
    }
    
    let parentStateName = relations.parent(stateName);
    let viewCount = _.keys(stateConfigs.views).length;
    let mainCount = 0;
    
    _.each(stateConfigs.views, (viewConfigs, viewHash) => {
      let {address} = viewConfigs;
      let viewAddress = address || viewHash;
      let viewAddressFull = fullAddressMaker(viewAddress, stateName);
      let [viewSelector, viewStateName] = addresser.parts(viewAddressFull);
      let viewAddressUnique = addresser.uniqueAddress(stateName);
      let duplicateViewConfigs = (previousSequence || []).concat(activationSequence)
        .filter(viewConfigs => viewConfigs.viewAddressFull === viewAddressFull);
      let otherView = (duplicateViewConfigs[0] || {}).view;
      
      if(otherView === viewConfigs.view) {
        return;
      }
      
      if(viewStateName !== parentStateName) {
        delete viewConfigs.main;
      }
      
      if(viewCount === 1) {
        viewConfigs.main = true;
      }
      
      if(viewConfigs.main) {
        if(++mainCount > 1) {
          error.throw(`multiple main views for [${stateName}]`, 'preprocessor');
        }
        
        _.extend(stateConfigs, {viewAddressUnique});
      }
      
      if(viewConfigs.resolves) {
        resolveDefinitions[viewAddressUnique] = resolvesNormalizer(viewConfigs, viewAddressUnique);
        resolveAddresses.push(viewAddressUnique);
      }
      
      if(viewConfigs.data) {
        dataParams[viewAddressUnique] = viewConfigs.data;
      }
      
      _.extend(viewConfigs, {viewAddressFull, stateName, viewHash, viewAddressUnique, viewSelector, viewStateName});
      
      viewNormalizer(viewConfigs);
      viewsRegistry[viewAddressUnique] = viewConfigs;
      activationSequence.push(viewConfigs);
      
      preprocess(viewStateName, activationSequence);
    });
    
    if(!mainCount) {
      error.throw(`state [${stateName}] must have a designated main view`, 'preprocessor');
    }
    
    _.each(stateConfigs.states, stateName => preprocess(stateName, activationSequence));
    
    if(previousSequence) {
      preprocess(stateName, previousSequence);
    }
    
    activationSequence.sort((viewConfigs1, viewConfigs2) => 
      relations.parts(addresser.stateName(viewConfigs1.viewAddressUnique)).length -
      relations.parts(addresser.stateName(viewConfigs2.viewAddressUnique)).length);
  }(stateName);
  
  return stateParams;
};
