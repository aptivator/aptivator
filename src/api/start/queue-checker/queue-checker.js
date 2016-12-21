import vars from '../../../lib/vars';

let {queue} = vars.states;

export default callback => {
  if(!queue.length) {
    return callback();
  }
  
  let undefinedStateNames = queue.map(stateDefinition => stateDefinition[0]).join(', ');
  
  callback(`unable to initialize [${undefinedStateNames}] states`);
};
