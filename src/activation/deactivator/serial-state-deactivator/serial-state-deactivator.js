import aptivator from '../../../lib/instance';

export default () => {
  let query = {flags: {active: true, parallel: false, transient: false}};
  let activeSerial = aptivator.history.findOne(query);

  if(activeSerial) {
    let {stateName} = activeSerial;
    aptivator.deactivate({name: stateName, stateParams: activeSerial});
  }
};
