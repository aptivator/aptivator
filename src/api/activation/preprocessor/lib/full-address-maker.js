import addresser from '../../../../lib/addresser';
import relations from '../../../../lib/relations';
import vars      from '../../../../lib/vars';

export default (viewAddress, containerStateName) => {
  let [region, stateName] = addresser.parts(viewAddress);
  
  if(!stateName) {
    stateName = relations.parent(containerStateName);
  } else if(stateName === '') {
    stateName = vars.rootStateName;
  }
  
  return `${region}@${stateName}`;
};
