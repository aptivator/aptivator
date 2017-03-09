import _                 from 'lodash';
import Backbone          from 'backbone';
import displayer         from '../../../lib/displayer';
import params            from '../../../lib/params';
import relations         from '../../../lib/relations';
import deactivator       from '../../../deactivation/deactivator/lib/deactivator';
import rootViewRegistrar from './root-view-registrar';
import viewApi from './view-api';

export default (viewConfigs, stateParams) => {
  let {view, record, region, uniqueAddress, detachHidden, addressStateName} = viewConfigs;
  let {instance, ui} = record;
  
  if(instance && ui) {
    instance.destroy();
  }
  
  let viewParameters = params.assemble(uniqueAddress, stateParams);
  
  instance = new view(viewParameters);
  _.extend(record, {instance, active: true});
  
  if(!(instance instanceof Backbone.View)) {
    return _.extend(instance, Backbone.Events);
  }
  
  _.extend(record, {detached: true, detach: detachHidden, ui: true});
  
  region.current.add(uniqueAddress);
  let serializeData = instance.serializeData;
  
  instance.serializeData = function(...args) {
    var data = serializeData && serializeData.apply(this, args);
    return _.extend(this.options, data, {aptivator: viewApi});
  };
  
  instance.on('destroy', () => {
    deactivator.focal({name: uniqueAddress, detach: {focal: true, children: true}});
    region.current.delete(uniqueAddress);
    
    _.extend(record, {active: false});
    
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
