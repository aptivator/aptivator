import _             from 'lodash';
import hideClassName from '../../../lib/hide-class';
import vars          from '../../../lib/vars';

let {activationRecords} = vars.states;

export default (viewAddressUnique, detach) => {
  let activationRecord = activationRecords[viewAddressUnique];
  let {instance} = activationRecord || {};
  
  if(!(activationRecord && instance)) {
    return;
  }
  
  let {$el} = instance;
  
  if(!detach) {
    detach = activationRecord.detach;
  }
  
  _.extend(activationRecord, {active: false, detached: detach});
  
  if(detach) {
    return $el.removeClass(hideClassName).detach();  
  }
  
  $el.addClass(hideClassName);
};
