import addresser     from '../../../../libs/addresser';
import vars          from '../../../../libs/vars';
import hideClassName from './hide-class';

let {activationRecords} = vars.states;

export default function viewsDisplayer(params) {
  let {cacheAddresses, regionInstance, excludes, viewsRegistry} = params;
  cacheAddresses.forEach(cacheAddress => {
    if(excludes && excludes.includes(cacheAddress)) { 
      return; 
    }
    
    let activationRecord = activationRecords[cacheAddress];
    
    if(activationRecord.detached) {
      regionInstance.$el.append(activationRecord.instance.$el);
    } else if(activationRecord.instance.$el.hasClass(hideClassName)){
      activationRecord.instance.$el.removeClass(hideClassName);
    }
    
    if(activationRecord.immediates) {
      activationRecord.immediates.forEach(cacheAddress => {
        if(viewsRegistry && viewsRegistry[cacheAddress]) { 
          return; 
        }
        
        let regionName = addresser.region(cacheAddress);
        let regionInstance = activationRecord.instance[regionName];
        viewsDisplayer({cacheAddresses: [cacheAddress], regionInstance});
      });
    }
  });
}
