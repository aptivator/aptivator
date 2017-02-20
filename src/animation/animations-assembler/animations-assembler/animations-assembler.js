import _                from 'lodash';
import error            from '../../../lib/error';
import relations        from '../../../lib/relations';
import vars             from '../../../lib/vars';
import elementAssembler from './element-assembler/element-assembler';

let {spaceSplitter, states} = vars;
let {activationRecords, registry} = states;

export default function animationsAssembler(stateName, animationType, animations, fromStateName) {
  let {viewsRegistry, animate = {}, viewAddressUnique} = registry[stateName];
  let {[animationType]: animationSettings = {}} = animate;
  let {active, instance} = activationRecords[viewAddressUnique];
  let {$el} = instance;
  let stateNameToUse = stateName;
  
  if(!_.isObject(animationSettings)) {
    animationSettings = {[stateNameToUse]: animationSettings};
  }
  
  if(fromStateName) {
    let family = relations.family(fromStateName);
    if(!family.includes(stateName) && !active) {
      return error.warn(`state [${stateName}] is not activated`, 'animator');
    }
    
    ({[animationType]: animationSettings = {}} = registry[fromStateName].animate || {}); 
  } else {
    if(animationSettings.self) {
      delete animationSettings[stateName];
      stateNameToUse = 'self';
    }
  }
  
  let {[stateNameToUse]: self_} = animationSettings;
  
  if(!_.isObject(self_)) {
    self_ = {base: self_};
  }

  let {base} = self_;

  if(!_.isObject(base)) {
    base = {classes: base};
  }
  
  let {classes: baseClasses, add: baseAdd, remove: baseRemove} = base;
  
  if(_.isString(baseClasses)) {
    baseClasses = baseClasses.trim().split(spaceSplitter);
  }
  
  _.each(self_.elements, (selectorConfigs, selector) => {
    elementAssembler(selector, selectorConfigs, stateName, $el, animations);
  });
  
  _.each(viewsRegistry, (viewConfigs, viewAddressUnique) => {
    let {$el} = activationRecords[viewAddressUnique].instance;
    let {viewHash, animate, viewStateName} = viewConfigs;
    let viewSettingsPath = [stateName, viewHash];
    let viewSettings = _.get(animations, viewSettingsPath);
    
    if(!viewSettings) {
      _.set(animations, viewSettingsPath, viewSettings = {$el, classes: []});
    }
    
    let {classes} = viewSettings;
    
    if(viewStateName !== stateName) {
      if(_.isNull(baseClasses)) {
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
    
    if(!_.isObject(animate)) {
      animate = {[animationType]: animate};
    }
    
    ({[animationType]: animate} = animate || {});
    
    if(fromStateName || _.isUndefined(animate)) {
      animate = self_[viewHash];
    }
  
    if(!_.isObject(animate)) {
      animate = {classes: animate};
    }
    
    let {classes: viewClasses, add, remove, elements} = animate;
    
    _.each(elements, (selectorConfigs, selector) => {
      elementAssembler(selector, selectorConfigs, stateName, $el, animations);
    });
    
    if(_.isString(viewClasses)) {
      viewClasses = viewClasses.trim().split(spaceSplitter);
    }
    
    if(_.isUndefined(viewClasses) && _.isNull(baseClasses)) {
      viewClasses = null;
    }
    
    if(_.isNull(viewClasses)) {
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
  
  if(!fromStateName) {
    _.each(_.omit(animationSettings, 'self'), (animationSettings, toStateName) => {
      animationsAssembler(toStateName, animationType, animations, stateName);
    });
  }
}