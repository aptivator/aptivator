import hideClassName from './hide-class';

export default viewConfigs => {
  let {record, parentRecord, addressSelector} = viewConfigs;
  let {detached, instance = {}} = record;
  let {$el} = instance;
  
  if(!$el) {
    return;
  }
  
  record.active = true;
  
  $el.removeClass(hideClassName);
  
  if(!detached) {
    return;
  }
  
  let {$el: $parentEl} = parentRecord.instance;
  let $regionEl = !addressSelector ? $parentEl : $parentEl.find(addressSelector).eq(0);

  record.detached = false;
  $regionEl.append($el);
};
