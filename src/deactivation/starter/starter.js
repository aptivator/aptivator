import _         from 'lodash';
import aptivator from '../../lib/aptivator';
import relations from '../../lib/relations';
import vars      from '../../lib/vars';

let {registry} = vars.states;

export default async params => {
  let {name, partial} = params;
  let stateConfigs = registry[name];

  let query = {stateName: name, flags: {deactivating: true}};
  let duplicateStateParams = aptivator.history.findOne(query);
  
  if(duplicateStateParams) {
    return;
  }
  
  if(!stateConfigs) {
    throw {errorType: 'undeclared', errorMessage: `state [${name}] does not exist`};
  }
  
  query = {stateName: name, flags: {active: true}};
  let stateParams = aptivator.history.findOne(query);
  let {flags} = stateParams;
  let family = flags.spliced ? [name] : relations.family(name);
  
  if(!stateParams) {
    return;
  }
  
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
