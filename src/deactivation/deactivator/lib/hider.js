import _             from 'lodash';
import hideClassName from '../../../lib/hide-class';
import vars          from '../../../lib/vars';

let {activationRecords} = vars.states;

export default (uniqueAddress, detach) => {
  let activationRecord = activationRecords[uniqueAddress];
  let {instance, ui} = activationRecord || {};
  
  if(!(ui && activationRecord && instance)) {
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
