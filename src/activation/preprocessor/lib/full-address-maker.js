import addresser from '../../../lib/addresser';
import relations from '../../../lib/relations';

import {rootStateName} from '../../../lib/vars';

export default (viewAddress, containerStateName) => {
  let [selector, stateName] = addresser.parts(viewAddress);
  
  if(stateName === '') {
    stateName = rootStateName;
  } else if(!stateName) {
    stateName = relations.parent(containerStateName);
  } else if(stateName === 'self') {
    stateName = containerStateName;
  }
  
  return `${selector}@${stateName}`;
};
