import error                   from '../../lib/error';
import vars                    from '../../lib/vars';
import missingParentsAssembler from './lib/missing-parents-assembler'; 

let {queue} = vars.states;

export default async () => {
  if(queue.length) {
    error.throw(`undeclared parent states: [${missingParentsAssembler(queue)}]`, 'starter');
  }
};
