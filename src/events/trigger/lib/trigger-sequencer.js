import _    from 'lodash';
import vars from '../../../lib/vars';

let {eventRegistry} = vars;

let sequenceMaker = (events, mainArgs, triggerSequence = []) => {
  events.forEach(event => {
    if(_.isString(event)) {
      if(eventRegistry[event]) {
        triggerSequence.push({handle: event, args: mainArgs, callbacks: eventRegistry[event]});
      }
      
      return;
    }
    
    let {handle, full, args} = event;
    
    if(full) {
      handle = handle.split(':');
      handle = _.range(1, handle.length + 1).map(end => handle.slice(0, end).join(':'));
    } else {
      handle = [handle];
    }
    
    handle.forEach(handle => sequenceMaker([handle], args || mainArgs, triggerSequence));
  });
  
  return triggerSequence;
};

export default (events, mainArgs) => 
  sequenceMaker(events, mainArgs).sort((...args) => 
    args[0].handle.split(':').length - args[1].handle.split(':').length);
