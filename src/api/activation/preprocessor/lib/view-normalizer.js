import _         from 'lodash';
import relations from '../../../../lib/relations';
import vars      from '../../../../lib/vars';

export default viewConfigs => {
  if(!_.isUndefined(viewConfigs.detachHidden)) {
    return;
  }
  
  let family = relations.family(viewConfigs.stateName).reverse();
  
  for(let relation of family) {
    let stateConfigs = vars.states.registry[relation];
    if(!_.isUndefined(stateConfigs.detachHidden)) {
      viewConfigs.detachHidden = stateConfigs.detachHidden;
      break;
    }
  }
};
