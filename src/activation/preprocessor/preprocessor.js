import _                    from 'lodash';
import Marionette           from 'backbone.marionette';
import addresser            from '../../lib/addresser';
import error                from '../../lib/error';
import relations            from '../../lib/relations';
import vars                 from '../../lib/vars';
import fullAddressMaker     from './lib/full-address-maker';
import resolvesNormalizer   from './lib/resolves-normalizer';
import viewNormalizer       from './lib/view-normalizer';

let {dataParams, resolveDefinitions, states} = vars;
let {registry} = states;
let reservedHashes = ['base', 'elements'];

export default stateParams => {
  let {stateName} = stateParams;
  stateParams.flags.preprocessed = true;
  
  !function preprocess(stateName) {
    let stateConfigs = registry[stateName];

    if(stateConfigs.resolveAddresses) {
      return;
    }

    let {data, resolves, view, views, template} = stateConfigs;
    let resolveAddresses = stateConfigs.resolveAddresses = [];
    let viewsArray = [];
    
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
      views = {[viewHash]: _.pick(stateConfigs, ['view', 'template', 'cache'])};
    }
    
    let parentStateName = relations.parent(stateName);
    let viewCount = _.keys(views).length;
    let mainCount = 0;
    
    _.each(views, (viewConfigs, viewHash) => {
      let {address = viewHash, main, resolves, data, view, template, deps} = viewConfigs;
      let fullAddress = fullAddressMaker(address, stateName);
      let [addressSelector, addressStateName] = addresser.parts(fullAddress);
      let uniqueAddress = addresser.uniqueAddress(stateName);
      
      if(reservedHashes.includes(viewHash)) {
        error.throw(`view hashes - ${reservedHashes.join(', ')} - are reserved`, 'preprocessor');
      }
      
      if(deps) {
        let {connectingViews} = stateConfigs;
        
        if(!connectingViews) {
          connectingViews = stateConfigs.connectingViews = [];
        }
        
        connectingViews.push(viewConfigs);
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
      viewsArray.push(viewConfigs);
      preprocess(addressStateName);
    });
    
    if(!mainCount && viewCount) {
      error.throw(`state [${stateName}] must have a designated main view`, 'preprocessor');
    }

    viewsArray.sort(relations.hierarchySorter());
    _.extend(stateConfigs, {views: viewsArray});
  }(stateName);
  
  return stateParams;
};
