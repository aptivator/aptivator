import params    from '../../../../libs/params';
import relations from '../../../../libs/relations';

export default (viewConfigs, stateParams) => {
  let {stateName, viewAddressUnique} = viewConfigs;
  let family = relations.family(stateName).concat(viewAddressUnique);
  return params.assemble(family, stateParams);
};
