import _            from 'lodash';
import vars         from '../../lib/vars';
import callbacker   from './lib/callbacker';

let {eventSplitter} = vars;

let levels = record => record.handle.split(':').length;

export default (events, mainArgs) => {
  if(_.isString(events)) {
    events = events.split(eventSplitter);
  }
  
  if(!_.isArray(events)) {
    events = [events];
  }
  
  let callbacks = callbacker(events, mainArgs);
  callbacks = _.uniqWith(callbacks, _.isEqual);
  return callbacks.sort((...records) => levels(records[0]) - levels(records[1]));
};
