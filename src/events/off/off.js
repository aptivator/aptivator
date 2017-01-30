import _          from 'lodash';
import vars       from '../../lib/vars';
import callbacker from '../callbacker/callbacker';

let {eventRegistry} = vars;

export default (events, callback, context) => {
  if(!events) {
    events = _.keys(eventRegistry);
    return events.forEach(event => delete eventRegistry[event]);
  }
  
  callbacker(events).forEach(eventRecord => {
    let {callbacks} = eventRecord;
    callbacks.splice(0, callbacks.length);
  });
};
