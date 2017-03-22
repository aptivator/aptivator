import _          from 'lodash';
import callbacker from '../callbacker/callbacker';

import {eventRegistry} from '../../lib/vars';

export default (events, callback, context) => {
  if(!events) {
    events = _.keys(eventRegistry);
    return events.forEach(event => delete eventRegistry[event]);
  }
  
  callbacker(events, [callback, context]).forEach(eventRecord => {
    let {callbacks, args} = eventRecord;
    let [callback, context] = args;
    
    let query = {};
    
    if(callback) {
      _.extend(query, {callback});
    }
    
    if(context) {
      _.extend(query, {context});
    }
    
    if(_.isEmpty(query)) {
      return callbacks.splice(0, callbacks.length);
    }
    
    _.filter(callbacks, query).forEach(callbackRecord => {
      let index = callbacks.indexOf(callbackRecord);
      callbacks.splice(index, 1);
    });
  });
};
