import _            from 'lodash';
import historyAdder from '../../history/history-adder';
import defaultFlags from './lib/default-flags';

export default async stateParams => {
  let {flags} = stateParams;
  
  if(!flags) {
    flags = stateParams.flags = {};
  }
  
  _.extend(stateParams.flags, defaultFlags, _.clone(flags));
  
  if(stateParams.name) {
    stateParams.stateName = stateParams.name;
    delete stateParams.name;
  }
  
  stateParams.hooks = {};
  historyAdder(stateParams);
  
  return stateParams;
};
