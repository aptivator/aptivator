import hideClassName from '../../../lib/hide-class';
import vars          from '../../../lib/vars';

let {activationRecords} = vars.states;

export default params => {
  let {targetRegion, regionInstance, multiple, excludes, includes} = params;
  targetRegion.current.forEach(cacheAddress => {
    if((excludes || []).includes(cacheAddress)) {
      return;
    }
    
    if(!multiple && !(includes || []).includes(cacheAddress)) {
      return;
    }
    
    let activationRecord = activationRecords[cacheAddress];
    let {$el} = activationRecord.instance;
    
    activationRecord.active = true;
    $el.removeClass(hideClassName);
    
    if(activationRecord.detached) {
      activationRecord.detached = false;
      $el.appendTo(regionInstance.$el);
    }
    
  });
};
