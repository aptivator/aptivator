import _             from 'lodash';
import vars          from '../../../../lib/vars';
import hideClassName from './hide-class';

let remover = {
  destroy: (activationRecord, multiple) => {
    if(!multiple) {
      _.each(activationRecord.regions, targetRegion => remover.hide({targetRegion, detach: true}));
    }
    activationRecord.instance.destroy();
  },
  
  hide: params => {
    let {targetRegion, cacheAddress, detach} = params;
    targetRegion.current.forEach(entityName => {
      let record = vars.states.activationRecords[entityName];
      let {$el} = record.instance;
      
      if(_.isBoolean(detach)) {
        record.detached = detach;
      } else {
        detach = record.detached;
      }
      
      let operation = detach ? 'detach' : 'addClass';
      let parameter = detach ? null : hideClassName;
      
      if(targetRegion.current !== cacheAddress) {
        $el[operation](parameter);
      }
      
      if(detach && $el.hasClass(hideClassName)) {
        $el.removeClass(hideClassName);
      }
      
      if(!_.isUndefined(cacheAddress)) {
        targetRegion.current.delete(entityName);
      }
      
      _.each(record.regions, targetRegion => remover.hide({targetRegion}));
    });
  }
};

export default remover;
