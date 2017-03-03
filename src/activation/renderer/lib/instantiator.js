import _                 from 'lodash';
import displayer         from '../../../lib/displayer';
import params            from '../../../lib/params';
import relations         from '../../../lib/relations';
import deactivator       from '../../../deactivation/deactivator/lib/deactivator';
import rootViewRegistrar from './root-view-registrar';
import viewApi from './view-api';

export default (viewConfigs, stateParams) => {
  let {view, record, region, uniqueAddress, detachHidden, addressStateName} = viewConfigs;
  let {instance} = record;
  
  if(instance) {
    instance.destroy();
  }
  
  let viewParameters = params.assemble(uniqueAddress, stateParams);
  
  instance = new view(viewParameters);
  
  region.current.add(uniqueAddress);
  _.extend(record, {active: true, instance, detached: true, detach: detachHidden});
  
  let serializeData = instance.serializeData;
  
  instance.serializeData = function(...args) {
    var data = serializeData && serializeData.apply(this, args);
    return _.extend(this.options, data, {aptivator: viewApi});
  };
  
  instance.on('destroy', () => {
    deactivator.partial({name: uniqueAddress, detach: {focal: true, children: true}});
    region.current.delete(uniqueAddress);
    
    if(record.dependency) {
      record.dependency = undefined;
    }
    
    if(record.dependent) {
      record.dependent = undefined;
    }
    
    delete record.instance;
  });

  instance.render();

  if(relations.isRoot(addressStateName)) {
    return rootViewRegistrar(viewConfigs, stateParams);
  }

  displayer(viewConfigs);    
};
