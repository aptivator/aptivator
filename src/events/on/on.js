import _         from 'lodash';
import registrar from './lib/registrar';
import unwinder  from './lib/unwinder';

export default (events, callback, context, once) => {
  if(_.isString(events) || _.isArray(events)) {
    return registrar(events, callback, context, once);
  }

  unwinder(events, [], once);
};
