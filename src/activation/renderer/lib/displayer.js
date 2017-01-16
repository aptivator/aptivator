import hideClassName from '../../../lib/hide-class';
import vars          from '../../../lib/vars';

let {activationRecords} = vars.states;
let $rootElements = [];

export default {
  single(activationRecord, regionInstance) {
    let {$el} = activationRecord.instance;
    
    activationRecord.active = true;
    
    if(activationRecord.detached) {
      activationRecord.detached = false;
      return regionInstance.$el.append($el);
    }
    
    $el.removeClass(hideClassName);
  },
  
  multiple(params) {
    let {targetRegion, regionInstance, transient, exclude} = params;
    
    targetRegion.current.forEach(viewAddressUnique => {
      if(exclude.includes(viewAddressUnique)) {
        return;
      }
      
      let activationRecord = activationRecords[viewAddressUnique];
      
      if(activationRecord.transient !== transient) {
        return;
      }
      
      this.single(activationRecord, regionInstance);
    });
  },
  
  roots: {
    add($el) {
      $rootElements.push($el.addClass(hideClassName));
    },
    
    display() {
      $rootElements.forEach($el => $el.removeClass(hideClassName));
      $rootElements = [];
    }
  }
};
