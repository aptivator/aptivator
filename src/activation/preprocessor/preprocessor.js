import _                    from 'lodash';
import Marionette           from 'backbone.marionette';
import addresser            from '../../lib/addresser';
import error                from '../../lib/error';
import relations            from '../../lib/relations';
import vars                 from '../../lib/vars';
import canceler             from '../canceler/canceler';
import fullAddressMaker     from './lib/full-address-maker';
import resolvesNormalizer   from './lib/resolves-normalizer';
import viewNormalizer       from './lib/view-normalizer';

let {dataParams, resolveDefinitions, states} = vars;
let {activationSequences, registry} = states;
let reservedHashes = ['base', 'elements'];

export default stateParams => {
  canceler(stateParams);
  
  let {stateName} = stateParams;
  stateParams.flags.preprocessed = true;
  
  !function preprocess(stateName, previousSequence) {
    let stateConfigs = registry[stateName];

    let activationSequence = activationSequences[stateName] || (activationSequences[stateName] = []);
    
    if(previousSequence && !_.isEmpty(activationSequence) && !relations.isRoot(stateName)) {
      return _.each(activationSequence, viewConfigs => {
        if(!previousSequence.includes(viewConfigs)) {
          previousSequence.push(viewConfigs);
        }
      });
    }
    
    if(stateConfigs.resolveAddresses) {
      return;
    }
    
    let {data, resolves, view, views, template} = stateConfigs;
    let resolveAddresses = stateConfigs.resolveAddresses = [];
    
    if(data) {
      dataParams[stateName] = data;
    }
    
    if(resolves) {
      resolveDefinitions[stateName] = resolvesNormalizer(stateConfigs, stateName);
      resolveAddresses.push(stateName);
    }
    
    if(relations.isRoot(stateName)) {
      return;
    }
    
    if((view || template) && !views) {
      let viewHash = stateConfigs.parentSelector || '';
      _.extend(stateConfigs, {
        views: {[viewHash]: _.pick(stateConfigs, ['view', 'template', 'cache'])}
      });
    }
    
    let parentStateName = relations.parent(stateName);
    let viewCount = _.keys(stateConfigs.views).length;
    let mainCount = 0;
    
    _.each(stateConfigs.views, (viewConfigs, viewHash) => {
      let {address = viewHash, main, resolves, data, view, template} = viewConfigs;
      let fullAddress = fullAddressMaker(address, stateName);
      let [addressSelector, addressStateName] = addresser.parts(fullAddress);
      let uniqueAddress = addresser.uniqueAddress(stateName);
      
      if(reservedHashes.includes(viewHash)) {
        error.throw(`view hashes - ${reservedHashes.join(', ')} - are reserved`, 'preprocessor');
      }
      
      if(template && !view) {
        view = Marionette.ItemView.extend({template});
      }
      
      if(addressStateName !== parentStateName) {
        delete viewConfigs.main;
      }
      
      if(viewCount === 1) {
        main = true;
      }
      
      if(main) {
        if(++mainCount > 1) {
          error.throw(`multiple main views for [${stateName}]`, 'preprocessor');
        }
        
        _.extend(stateConfigs, {uniqueAddress});
      }
      
      if(resolves) {
        resolveDefinitions[uniqueAddress] = resolvesNormalizer(viewConfigs, uniqueAddress);
        resolveAddresses.push(uniqueAddress);
      }
      
      if(data) {
        dataParams[uniqueAddress] = data;
      }
      
      _.extend(viewConfigs, {address, main, view, uniqueAddress, fullAddress, stateName, viewHash, addressSelector, addressStateName});
      
      viewNormalizer(viewConfigs);
      activationSequence.push(viewConfigs);
      preprocess(addressStateName, activationSequence);
    });
    
    if(!mainCount && viewCount) {
      error.throw(`state [${stateName}] must have a designated main view`, 'preprocessor');
    }

    if(previousSequence) {
      preprocess(stateName, previousSequence);
    }
    
    activationSequence.sort(relations.hierarchySorter());
  }(stateName);
  
  return stateParams;
};
