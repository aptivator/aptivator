import _         from 'lodash';
import addresser from '../../lib/addresser';
import error     from '../../lib/error';

export default stateConfigs => {
  let {view, stateName, resolveConfigs, detachHidden, testMode} = stateConfigs;
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
  
  if(!testMode) {
    var instance = new view();
    instance.render();
  }
  let record = {instance};
  let configs = {root: true, uniqueAddress, detachHidden, resolveConfigs, record};
  
  _.extend(stateConfigs, configs);
  
  stateConfigs.views = [_.omit(stateConfigs, 'animate')];
};
