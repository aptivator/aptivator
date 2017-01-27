import _             from 'lodash';
import hideClassName from './hide-class';
import vars          from './vars';

let {activationRecords} = vars.states;

export default {
  display(viewAddressUnique, $regionEl) {
    let activationRecord = activationRecords[viewAddressUnique];
    let {detached, instance} = activationRecord;
    
    if(!instance.isRendered) {
      instance.render();
    }
    
    let {$el} = instance;
    
    activationRecord.active = true;
    
    if(!detached) {
      return $el.removeClass(hideClassName);
    }
    
    activationRecord.detached = false;
    $regionEl.append($el);
  },
  
  hide(viewAddressUnique, detach) {
    let activationRecord = activationRecords[viewAddressUnique];
    
    if(!activationRecord) {
      return;
    }
    
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
