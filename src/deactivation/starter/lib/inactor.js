import _ from 'lodash';

export default function deactivator(statesParams) { 
  _.each(statesParams, stateParams => {
    let {flags, parallels} = stateParams;
    _.extend(flags, {active: false});
    deactivator(parallels);
  });
}
