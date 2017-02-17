import _         from 'lodash';
import error     from '../../lib/error';
import relations from '../../lib/relations';
import vars      from '../../lib/vars';

let {spaceSplitter, states, rootStateName} = vars;
let {activationRecords, registry} = states;

let stateNamesNormalizer = stateNames => {
  stateNames = _.reduce(stateNames, (stateNames, stateName) => {
    let family = relations.family(stateName);
    stateNames.push(...family);
    return stateNames;
  }, []);
  
  stateNames = _.uniq(stateNames);
  stateNames = _.difference(stateNames, [rootStateName]);
  stateNames.sort(relations.hierarchySorter()).unshift(rootStateName);
  return stateNames;
};

let processState = (stateName, settings, animationType, animations, origin) => {
  let {viewsRegistry} = registry[stateName];
  
  if(!_.isObject(settings)) {
    settings = {self: settings};
  }
  
  let {self: self_} = settings;
  
  if(!_.isObject(self_)) {
    self_ = {classes: self_};
  }
  
  let {classes: selfClasses, add: selfAdd, remove: selfRemove} = self_;
  
  if(selfAdd && selfRemove) {
    error.throw(`for [${stateName}] animations, specify either 'add' or 'remove' flag`, 'animator');
  }
  
  if(_.isString(selfClasses)) {
    selfClasses = selfClasses.trim().split(spaceSplitter);
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
      if(selfClasses === false) {
        _.remove(classes, () => true);
      } else if(selfClasses) {
        if(selfAdd) {
          classes.push(...selfClasses);
        } else if(selfRemove) {
          _.remove(classes, clss => selfClasses.includes(clss));
        } else {
          classes.splice(0, classes.length, ...selfClasses);
        }
      }
    }
    
    ({[animationType]: animate} = animate || {});
    
    if(!origin || _.isUndefined(animate)) {
      animate = settings[viewHash];
    }
  
    if(!_.isObject(animate)) {
      animate = {classes: animate};
    }
    
    let {classes: viewClasses, add, remove} = animate;
    
    if(_.isString(viewClasses)) {
      viewClasses = viewClasses.trim().split(spaceSplitter);
    }
    
    if(add && remove) {
      error.throw(`for [${viewHash}] view animations, in [${stateName}], specify either 'add' or 'remove' flag`, 'animator');
    }
    
    if((_.isUndefined(viewClasses) && selfClasses === false) || viewClasses === false) {
      return delete animations[stateName][viewHash];
    }
    
    if(_.isUndefined(viewClasses)) {
      return;
    }
    
    if(add) {
      classes.push(...viewClasses);
    } else if(remove) {
      _.remove(classes, clss => viewClasses.includes(clss));
    } else {
      classes.splice(0, classes.length, ...viewClasses);
    }
  });
};

let processSelector = () => {};

let animationsAssembler = (stateName, animationType, animations) => {
  let {animate} = registry[stateName];
  let {[animationType]: typeSettings = {}} = animate || {};
  
  if(!_.isObject(typeSettings)) {
    typeSettings = {self: typeSettings};
  }
  
  _.each(typeSettings, (entitySettings, entityName) => {
    if(entityName.includes('@')) {
      return processSelector(entityName, entitySettings, animations);
    } 
    
    if(entityName === 'self') {
      entityName = stateName;
    }
    
    let origin = stateName === entityName;  
      
    processState(entityName, entitySettings, animationType, animations, origin);
  });
  
  return animations;
};

export default (stateNames, animationType) => {
  stateNames = stateNamesNormalizer(stateNames);
  
  return _.reduce(stateNames, (animations, stateName) => {
    return animationsAssembler(stateName, animationType, animations);
  }, {});
};
