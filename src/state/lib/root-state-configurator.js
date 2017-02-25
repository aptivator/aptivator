import _         from 'lodash';
import addresser from '../../lib/addresser';

let rootStateProperties = ['view', 'resolves', 'data', 'route', 'resolveConfigs', 'detachHidden', 'animate'];

export default (stateName, stateConfigs) => {
  stateConfigs = _.pick(stateConfigs, rootStateProperties);
  
  if(!stateConfigs.resolveConfigs) {
    stateConfigs.resolveConfigs = {
      duration: 0,
      store: true
    };
  }
  
  if(_.isUndefined(stateConfigs.detachHidden)) {
    stateConfigs.detachHidden = false;
  }
  
  return _.extend(stateConfigs, {root: true, uniqueAddress: addresser.uniqueAddress(stateName)});
};
