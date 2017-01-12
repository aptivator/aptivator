import addresser from '../../../lib/addresser';
import relations from '../../../lib/relations';
import vars      from '../../../lib/vars';

export default (viewAddress, containerStateName) => {
  let [region, stateName] = addresser.parts(viewAddress);
  
  if(stateName === '') {
    stateName = vars.rootStateName;
  } else if(!stateName) {
    stateName = relations.parent(containerStateName);
  }
  
  return `${region}@${stateName}`;
};
