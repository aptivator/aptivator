import _                 from 'lodash';
import displayer         from '../../../lib/displayer';
import params            from '../../../lib/params';
import relations         from '../../../lib/relations';
import vars              from '../../../lib/vars';
import deactivator       from '../../../deactivation/deactivator/lib/deactivator';
import rootViewRegistrar from './root-view-registrar';
import viewApi from './view-api';

let {paramsMap} = vars;

export default (viewConfigs, stateParams) => {
  let {view, record, region, uniqueAddress, detachHidden, addressStateName, fullAddress, stateName, viewHash} = viewConfigs;
  let {instance} = record;
  
  if(instance) {
    instance.destroy();
  }
  
  let family = relations.family(uniqueAddress);
  let viewParameters = params.assemble(family, stateParams);
  
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
    //delete paramsMap[uniqueAddress];
    delete record.instance;
  });

  instance.render();

  if(relations.isRoot(addressStateName)) {
    return rootViewRegistrar(viewConfigs, stateParams);
  }

  displayer(viewConfigs);    
};
