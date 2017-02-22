import hideClassName from './hide-class';
import vars          from './vars';

let {activationRecords} = vars.states;

export default (uniqueAddress, $regionEl) => {
  let activationRecord = activationRecords[uniqueAddress];
  let {detached, instance} = activationRecord;
  let {$el} = instance;
  
  activationRecord.active = true;
  
  if(!detached) {
    return $el.removeClass(hideClassName);
  }
  
  activationRecord.detached = false;
  $regionEl.append($el);
};
