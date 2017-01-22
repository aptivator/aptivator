import _             from 'lodash';
import addresser     from '../../lib/addresser';
import displayer     from '../../lib/displayer';
import vars          from '../../lib/vars';
import detachFlagger from './detach-flagger';

let {activationRecords, activationSequences} = vars.states;

export default {
  full(params) {
    let {name} = params;
    let hasAt = name.includes('@');
    let stateName = hasAt ? addresser.stateName(name) : name;
    let activationSequence = activationSequences[stateName];
  
    _.each(activationSequence, viewConfigs => {
      displayer.hide(viewConfigs.viewAddressUnique);
    });
  },
  
  partial(params) {
    let {name, detach, focal} = params;
    let hasAt = name.includes('@');
    let viewAddressUnique = hasAt ? name : addresser.uniqueStateAddress(name);
    let {focal: detachFocal, children: detachChildren, full: detachFull} = detach || {};

    displayer.hide(viewAddressUnique, detachFlagger(detachFocal, detachFull));
    
    _.each(activationRecords[viewAddressUnique].regions, regionObj => {
      regionObj.current.forEach(viewAddressUnique => {
        if(focal) {
          return displayer.hide(viewAddressUnique, detachFlagger(detachChildren, detachFull));
        }
        
        let detach = {focal: detachChildren, full: detachFull};
        
        this.partial({name: viewAddressUnique, detach, focal});
      });
    });    
  }
};
