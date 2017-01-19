import error                   from '../../lib/error';
import vars                    from '../../lib/vars';
import missingParentsAssembler from './lib/missing-parents-assembler'; 

let {queue} = vars.states;

export default () => 
  new Promise(resolve => {
    if(!queue.length) {
      return resolve();
    }
    
    let missingParents = missingParentsAssembler(queue);
    
    error.throw(`undeclared parent states: [${missingParents}]`, 'starter');
  });
