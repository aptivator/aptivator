import _             from 'lodash';
import addresser     from '../../../lib/addresser';
import vars          from '../../../lib/vars';
import detachFlagger from './detach-flagger';
import hider         from './hider';

let {activationRecords, activationSequences, registry} = vars.states;

export default {
  full(params) {
    let {name} = params;
    let stateName = addresser.stateName(name);
    let activationSequence = activationSequences[stateName];
    
    _.each(activationSequence, viewConfigs => {
      hider(viewConfigs.viewAddressUnique);
    });
  },
  
  partial(params) {
    let {name, detach} = params;
    let hasAt = name.includes('@');
    let stateName = addresser.stateName(name);
    let viewAddressUnique = hasAt ? name : addresser.uniqueStateAddress(name);
    let {focal: detachFocal, children: detachChildren, full: detachFull} = detach || {};
    let stateConfigs = registry[stateName];
    let viewAddresses = new Set([viewAddressUnique]);
    
    if(stateConfigs.viewAddressUnique === viewAddressUnique) {
      _.each(stateConfigs.viewsRegistry, (viewConfigs, viewAddressUnique) => {
        if(viewConfigs.viewStateName !== stateName) {
          viewAddresses.add(viewAddressUnique);
        }
      });
    }

    viewAddresses.forEach(viewAddressUnique => {
      hider(viewAddressUnique, detachFlagger(detachFocal, detachFull));
    });
    
    _.each(activationRecords[viewAddressUnique].regions, regionObj => {
      regionObj.current.forEach(viewAddressUnique => {
        let detach = {focal: detachChildren, full: detachFull};
        this.partial({name: viewAddressUnique, detach});
      });
    });    
  }
};
