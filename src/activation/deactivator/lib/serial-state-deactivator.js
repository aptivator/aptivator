import _         from 'lodash';
import aptivator from '../../../lib/aptivator';

export default () => {
  let query = {flags: {active: true, parallel: false, transient: false}};
  let activeSerial = aptivator.history.findOne(query);

  if(activeSerial) {
    return aptivator.deactivate({name: activeSerial.stateName}).catch(_.noop);
  }
  
  return Promise.resolve();
};
