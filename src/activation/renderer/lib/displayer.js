import displayer         from '../../../lib/displayer';
import params            from '../../../lib/params';
import relations         from '../../../lib/relations';
import rootViewRegistrar from './root-view-registrar';

export default (viewConfigs, stateParams, cacheAssessor) => {
  let {addressStateName, uniqueAddress} = viewConfigs;
  
  if(!cacheAssessor.implicit.cache) {
    let cacheConfigs = cacheAssessor.explicit.cache;
    let {receiver} = cacheConfigs || {};
    
    if(receiver) {
      let {instance} = viewConfigs.record;
      let viewParameters = params.assemble(uniqueAddress, stateParams);
      instance[receiver](viewParameters);
    }
  }

  if(relations.isRoot(addressStateName)) {
    return rootViewRegistrar(viewConfigs, stateParams);
  }

  displayer(viewConfigs);
};
