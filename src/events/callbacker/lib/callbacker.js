import _    from 'lodash';
import vars from '../../../lib/vars';

let {eventRegistry} = vars;

export default function callbacker(events, mainArgs, callbacks = []) {
  events.forEach(event => {
    if(_.isString(event)) {
      if(!_.isEmpty(eventRegistry[event])) {
        callbacks.push({handle: event, args: mainArgs, callbacks: eventRegistry[event]});
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
    
    handle.forEach(handle => callbacker([handle], args || mainArgs, callbacks));
  });
  
  return callbacks;
}
