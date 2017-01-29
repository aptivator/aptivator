import _    from 'lodash';
import vars from '../../lib/vars';

let {eventRegistry} = vars;

export default handle => {
  if(!handle) {
    let events = _.keys(eventRegistry);
    events.forEach(event => delete eventRegistry[event]);
  }
};
