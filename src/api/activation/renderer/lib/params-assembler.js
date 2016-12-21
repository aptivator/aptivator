import params    from '../../../../lib/params';
import relations from '../../../../lib/relations';

export default (viewConfigs, stateParams) => {
  let {stateName, viewAddressUnique} = viewConfigs;
  let family = relations.family(stateName).concat(viewAddressUnique);
  return params.assemble(family, stateParams);
};
