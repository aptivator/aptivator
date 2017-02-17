import _                 from 'lodash';
import error             from '../../../lib/error';
import vars              from '../../../lib/vars';
import selectorAssembler from './selector-assembler/selector-assembler';

let {spaceSplitter, states} = vars;
let {activationRecords, registry} = states;

export default function animationsAssembler(stateName, animationType, animations, origin) {
  let {viewsRegistry, animate = {}} = registry[stateName];
  let {[animationType]: typeSettings = {}} = animate;
  
  if(typeSettings.self) {
    delete typeSettings[stateName];
  }
  
  if(typeSettings[stateName]) {
    typeSettings.self = typeSettings[stateName];
    delete typeSettings[stateName];
  }
  
  let {self: self_} = typeSettings || {};
  
  if(!_.isObject(self_)) {
    self_ = {base: self_};
  }
  
  let {base} = self_;

  if(!_.isObject(base)) {
    base = {classes: base};
  }
  
  let {classes: baseClasses, add: baseAdd, remove: baseRemove} = base;
  
  if(baseAdd && baseRemove) {
    baseRemove = false;
  }
  
  if(_.isString(baseClasses)) {
    baseClasses = baseClasses.trim().split(spaceSplitter);
  }
  
  _.each(viewsRegistry, (viewConfigs, viewAddressUnique) => {
    let {active, instance} = activationRecords[viewAddressUnique] || {};
    let {$el} = instance;
    let {viewHash, animate, viewStateName} = viewConfigs;
    let viewSettingsPath = [stateName, viewHash];
    let viewSettings = _.get(animations, viewSettingsPath);
    
    if(!viewSettings) {
      _.set(animations, viewSettingsPath, viewSettings = {$el, classes: []});
    }
    
    let {classes} = viewSettings;
    
    if(!active) {
      return error.warn(`state [${stateName}] is not activated`, 'animator');
    }
    
    if(viewStateName !== stateName) {
      if(baseClasses === false) {
        _.remove(classes, () => true);
      } else if(baseClasses) {
        if(baseAdd) {
          classes.push(...baseClasses);
        } else if(baseRemove) {
          _.remove(classes, klass => baseClasses.includes(klass));
        } else {
          classes.splice(0, classes.length, ...baseClasses);
        }
      }
    }
    
    if(animate === false) {
      animate = {[animationType]: animate};
    }
    
    ({[animationType]: animate} = animate || {});
    
    if(!origin || _.isUndefined(animate)) {
      animate = self_[viewHash];
    }
  
    if(!_.isObject(animate)) {
      animate = {classes: animate};
    }
    
    let {classes: viewClasses, add, remove} = animate;
    
    if(_.isString(viewClasses)) {
      viewClasses = viewClasses.trim().split(spaceSplitter);
    }
    
    if(add && remove) {
      remove = false;
    }
    
    if(_.isUndefined(viewClasses) && baseClasses === false) {
      viewClasses = false;
    }
    
    if(viewClasses === false) {
      return delete animations[stateName][viewHash];
    }
    
    if(_.isUndefined(viewClasses)) {
      return;
    }
    
    if(add) {
      classes.push(...viewClasses);
    } else if(remove) {
      _.remove(classes, klass => viewClasses.includes(klass));
    } else {
      classes.splice(0, classes.length, ...viewClasses);
    }
  });
  
  _.each(_.omit(typeSettings, 'self'), (animationSettings, entityName) => {
    if(entityName.includes('@')) {
      return selectorAssembler(entityName, animationSettings, animations);
    }
    
    animationsAssembler(entityName, animationType, animations, false);
  });
  
  return animations;
}
