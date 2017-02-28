import _         from 'lodash';
import addresser from '../../lib/addresser';
import error     from '../../lib/error';
import vars      from '../../lib/vars';

let {rootStateName, states} = vars;
let {activationRecords, activationSequences} = states;

export default stateConfigs => {
  let {view, stateName, resolveConfigs, detachHidden} = stateConfigs;
  let uniqueAddress = addresser.uniqueAddress(stateName);
  
  if(!view) {
    error.throw('root state should have a designated view', 'state setter');
  }

  if(!resolveConfigs) {
    resolveConfigs = {
      duration: 0,
      store: true
    };
  }
  
  if(_.isUndefined(detachHidden)) {
    detachHidden = false;
  }
  
  let instance = new view();
  let configs = {root: true, uniqueAddress, viewHash: '', detachHidden, resolveConfigs};
  
  _.extend(stateConfigs, configs);
  instance.render();
  
  activationRecords[uniqueAddress] = {instance, active: true};
  activationSequences[rootStateName] = [_.omit(stateConfigs, 'animate')];
};
