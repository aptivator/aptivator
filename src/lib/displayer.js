import hideClassName from './hide-class';
import vars          from './vars';

let {activationRecords} = vars.states;

export default (viewAddressUnique, $regionEl) => {
  let activationRecord = activationRecords[viewAddressUnique];
  let {detached, instance} = activationRecord;
  let {$el} = instance;
  
  activationRecord.active = true;
  
  if(!detached) {
    return $el.removeClass(hideClassName);
  }
  
  activationRecord.detached = false;
  $regionEl.append($el);
};
