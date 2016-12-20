import _         from 'lodash';
import addresser from '../../../../libs/addresser';
import relations from '../../../../libs/relations';

export default viewAddresses => {
  let roots = viewAddresses.filter(viewAddress => relations.isRoot(addresser.stateName(viewAddress)));
  let comparator = (viewAddress1, viewAddress2) => 
    relations.family(addresser.stateName(viewAddress1)).length >
    relations.family(addresser.stateName(viewAddress2)).length;
  viewAddresses = _.difference(viewAddresses, roots);
  viewAddresses.sort(comparator);
  return roots.concat(viewAddresses);
};
