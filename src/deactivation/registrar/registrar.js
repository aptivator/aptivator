import _         from 'lodash';
import aptivator from '../../lib/instance';
import vars      from '../../lib/vars';

let {registry} = vars.states;

export default async params => {
  let {name, partial} = params;
  
  if(!registry[name]) {
    throw {errorType: 'undeclared', errorMessage: `state [${name}] does not exist`};
  }
  
  let query = {stateName: name, flags: {active: true}};
  let stateParams = aptivator.history.findOne(query);
  
  if(!stateParams) {
    throw {errorType: 'inactive', errorMessage: `state [${name}] is not activated`};
  }
  
  _.extend(stateParams.flags, {deactivating: true, partial});

  return stateParams;
};
