import _            from 'lodash';
import vars         from '../../lib/vars';
import historyAdder from '../../history/history-adder';
import defaultFlags from './lib/default-flags';

let {registry} = vars.states;

export default async stateParams => {
  let {stateName, name = stateName, flags} = stateParams;
  
  if(!registry[name]) {
    throw {errorType: 'undeclared', errorMessage: `state [${name}] does not exist`};
  }
  
  if(!flags) {
    flags = stateParams.flags = {};
  }
  
  _.extend(stateParams.flags, defaultFlags, _.clone(flags));
  
  if(!stateName) {
    stateParams.stateName = name;
    delete stateParams.name;
  }
  
  historyAdder(stateParams);
  
  return stateParams;
};
