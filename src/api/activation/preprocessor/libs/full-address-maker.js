import addresser from '../../../../libs/addresser';
import relations from '../../../../libs/relations';
import vars      from '../../../../libs/vars';

export default (viewAddress, containerStateName) => {
  let [region, stateName] = addresser.parts(viewAddress);
  
  if(!stateName) {
    stateName = relations.parent(containerStateName);
  } else if(stateName === '') {
    stateName = vars.rootStateName;
  }
  
  return `${region}@${stateName}`;
};
