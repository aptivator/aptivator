import aptivator from '../lib/aptivator';
import error     from '../lib/error';
import vars      from '../lib/vars';

let {activationRecords} = vars.states;

aptivator.destroy = params => {
  let {name} = params;
  let activationRecord = activationRecords[name];
  
  if(!activationRecord) {
    error.throw(`state [${name}] has not been activated`, 'state remover');
  }
  
  activationRecord.instance.destroy();
};

