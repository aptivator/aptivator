import _                 from 'lodash';
import Backbone          from 'backbone';
import animator          from '../../../animation/animator';
import displayer         from '../../../lib/displayer';
import paramsAssembler   from '../../../lib/params-assembler';
import relations         from '../../../lib/relations';
import deactivator       from '../../../deactivation/deactivator/lib/deactivator';
import rootViewRegistrar from './root-view-registrar';
import viewApi           from './view-api';

import {configs} from '../../../lib/vars';

export default (viewConfigs, stateParams) => {
  let {view, record, region, uniqueAddress, detachHidden, addressStateName} = viewConfigs;
  let {instance, ui} = record;
  
  if(instance && ui) {
    instance.destroy();
  }
  
  let params = paramsAssembler(uniqueAddress, stateParams);
  
  instance = new view(params);
  _.extend(record, {instance, active: true});
  
  if(!(instance instanceof Backbone.View)) {
    return _.extend(instance, Backbone.Events);
  }
  
  _.extend(record, {detached: true, detach: detachHidden, ui: true});
  
  region.current.add(uniqueAddress);
  let {destroy, serializeData} = instance;
  
  instance.serializeData = function(...args) {
    var data = serializeData && serializeData.apply(this, args);
    return _.extend(this.options, data, {aptivator: viewApi}, configs.templateVars);
  };
  
  instance.destroy = async function(params = {}) {
    let {animate} = params;
    
    let animationState = {
      stateParams,
      beginningStateName: uniqueAddress,
      stateName: uniqueAddress,
      primary: true
    };
    
    if(animate) {
      await animator(animationState, 'exit');
    }
    
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
    
    destroy.call(this);
  };

  instance.render();

  if(relations.isRoot(addressStateName)) {
    return rootViewRegistrar(viewConfigs, stateParams);
  }

  displayer(viewConfigs);    
};
