import _                from 'lodash';
import addresser        from '../../../lib/addresser';
import error            from '../../../lib/error';
import params_          from '../../../lib/params';
import relations        from '../../../lib/relations';
import vars             from '../../../lib/vars';
import elementAssembler from './element-assembler';

let {spaceSplitter, states} = vars;
let {activationRecords, activationSequences, registry} = states;

export default function animationsAssembler(entityName, stateParams, animationType, animations, fromStateName) {
  let hasAt = entityName.includes('@');
  let stateName = addresser.stateName(entityName);
  let {animate = {}, uniqueAddress} = registry[stateName];
  let {[animationType]: animationSettings = {}} = animate;
  let {active, instance = {}} = activationRecords[uniqueAddress];
  let {$el} = instance;
  let stateNameToUse = stateName;
  
  if(!_.isPlainObject(animationSettings)) {
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
  
  if(!_.isPlainObject(self_)) {
    self_ = {base: self_};
  }

  let {base} = self_;

  if(!_.isPlainObject(base)) {
    base = {classes: base};
  }
  
  let {classes: baseClasses, add: baseAdd, remove: baseRemove} = base;
  
  if(_.isFunction(baseClasses)) {
    let params = params_.assemble(stateName, stateParams);
    baseClasses = baseClasses(params);
  }
  
  if(_.isString(baseClasses)) {
    baseClasses = baseClasses.trim().split(spaceSplitter);
  }
  
  if($el) {
    _.each(self_.elements, (selectorConfigs, selector) => {
      elementAssembler({selector, selectorConfigs, stateName, stateParams, $el, animations});
    });
  }
  
  _.each(activationSequences[stateName], viewConfigs => {
    let {uniqueAddress, viewHash, animate, addressStateName} = viewConfigs;
    let {$el} = activationRecords[uniqueAddress].instance || {};
    
    if((hasAt && uniqueAddress !== entityName) || !$el) {
      return;
    }
    
    let viewSettingsPath = [stateName, viewHash];
    let viewSettings = _.get(animations, viewSettingsPath);
    
    if(!viewSettings) {
      _.set(animations, viewSettingsPath, viewSettings = {$el, classes: []});
    }
    
    let {classes} = viewSettings;
    
    if(addressStateName !== stateName) {
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
    
    if(!_.isPlainObject(animate)) {
      animate = {[animationType]: animate};
    }
    
    ({[animationType]: animate} = animate || {});
    
    if(fromStateName || _.isUndefined(animate)) {
      animate = self_[viewHash];
    }
  
    if(!_.isPlainObject(animate)) {
      animate = {classes: animate};
    }
    
    let {classes: viewClasses, add, remove, elements} = animate;
    
    if(_.isFunction(viewClasses)) {
      let params = params_.assemble(uniqueAddress, stateParams);
      viewClasses = viewClasses(params);
    }
    
    _.each(elements, (selectorConfigs, selector) => {
      elementAssembler({selector, selectorConfigs, uniqueAddress, stateParams, $el, animations});
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
  
  if(!fromStateName && !hasAt) {
    _.each(_.omit(animationSettings, 'self'), (animationSettings, toStateName) => {
      animationsAssembler(toStateName, stateParams, animationType, animations, stateName);
    });
  }
}
