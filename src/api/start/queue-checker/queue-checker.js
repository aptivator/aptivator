import vars from '../../../libs/vars';

export default callback => {
  if(!vars.states.queue.length) {
    return callback();
  }
  
  let undefinedStateNames = vars.states.queue.map(stateDefinition => stateDefinition[0]).join(', ');
  
  callback(`unable to initialize [${undefinedStateNames}] states`);
};
