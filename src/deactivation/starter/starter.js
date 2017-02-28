import _         from 'lodash';
import aptivator from '../../lib/instance';
import relations from '../../lib/relations';
import vars      from '../../lib/vars';

let {deactivating, states} = vars;
let {registry} = states;

export default async params => {
  let {name, partial} = params;
  let stateConfigs = registry[name];

  if(deactivating.includes(name)) {
    return;
  }

  if(!stateConfigs) {
    throw {errorType: 'undeclared', errorMessage: `state [${name}] does not exist`};
  }
  
  let query = {stateName: name, flags: {active: true}};
  let stateParams = aptivator.history.findOne(query);
  let family = relations.family(name);
  
  if(!stateParams) {
    throw {errorType: 'inactive', errorMessage: `state [${name}] is not activated`};
  }
  
  deactivating.push(name);
  
  _.extend(stateParams.flags, {deactivating: true, partial});

  _.each(family, relation => {
    let stateConfigs = registry[relation];
    _.each(stateConfigs.states, stateParams => {
      let {name} = stateParams;
      aptivator.deactivate({name}).catch(_.noop);
    });
  });

  return stateParams;
};
