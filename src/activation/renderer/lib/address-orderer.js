import _         from 'lodash';
import addresser from '../../../lib/addresser';
import relations from '../../../lib/relations';

export default viewAddresses => {
  let roots = viewAddresses.filter(viewAddress => relations.isRoot(addresser.stateName(viewAddress)));
  viewAddresses = _.difference(viewAddresses, roots);
  viewAddresses.sort((viewAddress1, viewAddress2) => 
    relations.parts(addresser.stateName(viewAddress1)).length >
    relations.parts(addresser.stateName(viewAddress2)).length);
  return roots.concat(viewAddresses);
};
