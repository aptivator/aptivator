import _         from 'lodash';
import addresser from '../../lib/addresser';
import error     from '../../lib/error';
import vars      from '../../lib/vars';

let {activationRecords} = vars.states;

export default stateConfigs => {
  let {view, stateName, resolveConfigs, detachHidden} = stateConfigs;
  let uniqueAddress = addresser.uniqueAddress(stateName);
  
  if(!view) {
    error.throw('root state should have a designated view', 'state setter');
  }

  let instance = new view();
  instance.render();
  activationRecords[uniqueAddress] = {instance, active: true};
  
  if(!resolveConfigs) {
    resolveConfigs = {
      duration: 0,
      store: true
    };
  }
  
  if(_.isUndefined(detachHidden)) {
    detachHidden = false;
  }
  
  let configs = {root: true, uniqueAddress, viewsRegistry: {[uniqueAddress]: {}}, detachHidden, resolveConfigs};
  _.extend(stateConfigs, configs);
};
