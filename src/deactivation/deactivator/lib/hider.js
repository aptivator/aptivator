import _             from 'lodash';
import hideClassName from '../../../lib/hide-class';

export default (record, detach) => {
  let {active, instance = {}} = record;
  let {$el} = instance;
  
  if((!active && !detach) || !$el) {
    return;
  }
  
  if(!detach) {
    ({detach} = record);
  }
  
  _.extend(record, {active: false, detached: detach});
  
  if(detach) {
    return $el.removeClass(hideClassName).detach();  
  }
  
  $el.addClass(hideClassName);
};
