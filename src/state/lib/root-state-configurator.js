import _         from 'lodash';
import addresser from '../../lib/addresser';
import error     from '../../lib/error';

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
  let record = {instance};
  let configs = {root: true, uniqueAddress, detachHidden, resolveConfigs, record};
  
  _.extend(stateConfigs, configs);
  instance.render();
  
  stateConfigs.views = [_.omit(stateConfigs, 'animate')];
};
