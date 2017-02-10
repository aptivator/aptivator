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
      this.partial({name: viewConfigs.viewAddressUnique});
    });
  },
  
  partial(params) {
    let {name} = params;
    let viewAddressUnique = name.includes('@') ? name : registry[name].viewAddressUnique;
    let stateName = addresser.stateName(viewAddressUnique);
    let stateConfigs = registry[stateName];
    let viewAddresses = new Set([viewAddressUnique]);
    let activationRecord = activationRecords[viewAddressUnique];
    
    if(!activationRecord.active) {
      return;
    }
    
    if(stateConfigs.viewAddressUnique === viewAddressUnique) {
      _.each(stateConfigs.viewsRegistry, (viewConfigs, viewAddressUnique) => {
        if(viewConfigs.viewStateName !== stateName) {
          viewAddresses.add(viewAddressUnique);
        }
      });
    }

    let {focal: detachFocal, children: detachChildren, full: detachFull} = params.detach || {};

    viewAddresses.forEach(viewAddressUnique => {
      hider(viewAddressUnique, detachFlagger(detachFocal, detachFull));
    });
    
    let detach = {focal: detachChildren, full: detachFull};
    
    _.each(activationRecord.regions, regionObj => {
      regionObj.current.forEach(viewAddressUnique => {
        this.partial({name: viewAddressUnique, detach});
      });
    });    
  }
};
