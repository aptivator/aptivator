import _         from 'lodash';
import aptivator from '../lib/instance';
import error     from '../lib/error';
import vars      from '../lib/vars';

let {activationRecords} = vars.states;

aptivator.destroy = params => {
  let {name} = params;
  let activationRecord = activationRecords[name];
  
  if(!activationRecord) {
    error.throw(`state [${name}] has not been activated`, 'state remover');
  }
  
  _.each(activationRecord.regions, regionObj => {
    regionObj.current.forEach(name => aptivator.deactivate({name, detach: true, focal: true}));
  });
  
  activationRecord.instance.destroy();
  activationRecord.instance = null;
};
