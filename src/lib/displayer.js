import hideClassName from './hide-class';

export default viewConfigs => {
  let {record, parentRecord, addressSelector} = viewConfigs;
  let {detached, instance} = record;
  let {$el} = instance;
  
  record.active = true;
  
  if(!detached) {
    return $el.removeClass(hideClassName);
  }
  
  let {$el: $parentEl} = parentRecord.instance;
  let $regionEl = !addressSelector ? $parentEl : $parentEl.find(addressSelector).eq(0);
  
  record.detached = false;
  $regionEl.append($el);
};
