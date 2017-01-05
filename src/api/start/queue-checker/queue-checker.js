import error from '../../../lib/error';
import vars  from '../../../lib/vars';

let {queue} = vars.states;

export default callback => {
  try {
    if(!queue.length) {
      return callback();
    }
    
    let undefinedStateNames = queue.map(stateDefinition => stateDefinition[0]).join(', ');
    error.throw(`unable to initialize [${undefinedStateNames}] states`);
  } catch(e) {
    callback(e);
  }
};
