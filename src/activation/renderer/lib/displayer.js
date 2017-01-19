import hideClassName from '../../../lib/hide-class';

let $rootElements = [];

export default {
  single(activationRecord, $regionEl) {
    let {$el} = activationRecord.instance;
    
    activationRecord.active = true;
    
    if(!activationRecord.detached) {
      return $el.removeClass(hideClassName);
    }
    
    activationRecord.detached = false;
    $regionEl.append($el);
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
