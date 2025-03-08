import _ from 'lodash';

export default function inactor(statesParams) { 
  _.each(statesParams, stateParams => {
    let {flags, parallels} = stateParams;
    _.extend(flags, {active: false});
    inactor(parallels);
  });
}
