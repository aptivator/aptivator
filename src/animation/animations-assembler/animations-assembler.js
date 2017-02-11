import _         from 'lodash';
import addresser from '../../lib/addresser';
import error     from '../../lib/error';
import vars      from '../../lib/vars';

let {spaceSplitter, states} = vars;
let {activationRecords, registry} = states;

export default (statesParams, animationType) => 
  statesParams.reduce((animations, stateParams) => {
    let {animate} = registry[stateParams.stateName];
    let {[animationType]: animationsMap} = animate || {};
    
    _.each(animationsMap, (classNames, entityName) => {
      let stateName = addresser.stateName(entityName);
      let stateConfigs = registry[stateName];
      let {viewAddressUnique} = stateConfigs || {};
      let activationRecord = activationRecords[viewAddressUnique] || {};
      let {$el} = activationRecord.instance || {};
      let selector = entityName.includes('@') && addresser.region(entityName);
      
      if(!stateConfigs) {
        return error.warn(`state [${stateName}] does not exist`, 'animator');
      }
      
      if(!activationRecord.active) {
        return error.warn(`state [${stateName}] is not activated`, 'animator');
      }
      
      if(selector && !($el = $el.find(selector)).size()) {
        return error.warn(`no elements were found using [${selector}] selector`, 'animator');
      }
      
      let stateAnimations = animations[entityName] || (animations[entityName] = {});
      let {classes} = stateAnimations;
      
      if(!classes) {
        classes = new Set();
        _.extend(stateAnimations, {$el, classes});
      }
      
      classes.add(...classNames.trim().split(spaceSplitter));
    });
    
    return animations;
  }, {});
