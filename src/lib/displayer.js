import _             from 'lodash';
import hideClassName from './hide-class';
import vars          from './vars';

let {activationRecords} = vars.states;

export default {
  display(activationRecord, $regionEl) {
    
  },
  
  hide(viewAddressUnique, detach) {
    let activationRecord = activationRecords[viewAddressUnique];
    let {$el} = activationRecord.instance;
    
    if(!detach) {
      detach = activationRecord.detach;
    }
    
    _.extend(activationRecord, {active: false, detached: detach});
    
    if(detach) {
      return $el.removeClass(hideClassName).detach();  
    }
    
    $el.addClass(hideClassName);
  }
};
