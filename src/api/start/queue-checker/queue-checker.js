import error from '../../../lib/error';
import vars  from '../../../lib/vars';

let {queue} = vars.states;

export default () => 
  new Promise(resolve => {
    if(!queue.length) {
      return resolve();
    }
    
    let undefinedStateNames = queue.map(stateDefinition => stateDefinition[0]).join(', ');
    error.throw(`unable to initialize [${undefinedStateNames}] states`);
  });
