import _             from 'lodash';
import addresser     from '../../../lib/addresser';
import vars          from '../../../lib/vars';
import detachFlagger from './detach-flagger';
import hider         from './hider';

let {activationRecords, activationSequences, registry} = vars.states;

export default {
  full(params) {
    let stateName = addresser.stateName(params.name);
    let activationSequence = activationSequences[stateName];
    
    _.each(activationSequence, viewConfigs => {
      this.partial({name: viewConfigs.uniqueAddress});
    });
  },
  
  partial(params) {
    let {name} = params;
    let uniqueAddress = name.includes('@') ? name : registry[name].uniqueAddress;
    let stateName = addresser.stateName(uniqueAddress);
    let stateConfigs = registry[stateName];
    let viewAddresses = new Set([uniqueAddress]);
    let activationRecord = activationRecords[uniqueAddress] || {};
    
    if(!activationRecord.active) {
      return;
    }
    
    if(stateConfigs.uniqueAddress === uniqueAddress) {
      _.each(stateConfigs.viewsRegistry, (viewConfigs, uniqueAddress) => {
        if(viewConfigs.addressStateName !== stateName) {
          viewAddresses.add(uniqueAddress);
        }
      });
    }

    let {focal: detachFocal, children: detachChildren, full: detachFull} = params.detach || {};

    viewAddresses.forEach(uniqueAddress => {
      hider(uniqueAddress, detachFlagger(detachFocal, detachFull));
    });
    
    let detach = {focal: detachChildren, full: detachFull};
    
    _.each(activationRecord.regions, regionObj => {
      regionObj.current.forEach(uniqueAddress => {
        this.partial({name: uniqueAddress, detach});
      });
    });    
  }
};
