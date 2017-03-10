import _         from 'lodash';
import aptivator from '../../lib/aptivator';
import relations from '../../lib/relations';
import vars      from '../../lib/vars';
import inactor   from './lib/inactor';

let {deactivating, states} = vars;
let {registry} = states;

export default async params => {
  let {name, partial} = params;
  let stateConfigs = registry[name];

  if(deactivating.includes(name)) {
    return;
  }
  
  if(!stateConfigs) {
    throw {type: 'undeclared', message: `state [${name}] does not exist`};
  }
  
  let query = {stateName: name, flags: {active: true}};
  let statesParams = aptivator.history.find(query);
  let stateParams = statesParams[0];
  
  if(!stateParams) {
    return;
  }
  
  inactor(statesParams.slice(1));
  
  let {flags} = stateParams;
  let family = flags.spliced ? [name] : relations.family(name);
  
  deactivating.push(name);
  
  _.extend(flags, {deactivating: true, partial});

  _.each(family, relation => {
    let stateConfigs = registry[relation];
    _.each(stateConfigs.states, stateParams => {
      let {name} = stateParams;
      aptivator.deactivate({name}).catch(_.noop);
    });
  });

  return stateParams;
};
