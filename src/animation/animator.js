import _     from 'lodash';
import error from '../lib/error';
import vars  from '../lib/vars';

let {states, spaceSplitter} = vars;
let {activationRecords, registry} = states;

let animationHandle = 'animationend transitionend';

export default class {
  constructor(states, type) {
    _.extend(this, {states, type});
    this.prepare();
  }
  
  prepare({states} = this) {
    if(states !== this.states) {
      _.extend(this, {states});
    }
    
    this.animations = states.reduce((animations, stateParams) => {
      let {animate} = registry[stateParams.stateName];
      let {[this.type]: animationsMap} = animate || {};
      
      _.each(animationsMap, (classNames, stateName) => {
        let stateConfigs = registry[stateName];
        let {viewAddressUnique} = stateConfigs || {};
        let activationRecord = activationRecords[viewAddressUnique];
        
        if(!stateConfigs) {
          return error.warn(`state [${stateName}] does not exist`, 'animator');
        }
        
        if(!(viewAddressUnique && activationRecord && activationRecord.active)) {
          return error.warn(`state [${stateName}] is not activated`, 'animator');
        }
        
        let stateAnimations = animations[stateName] || (animations[stateName] = {});
        let {$el, classes} = stateAnimations;
        
        if(!$el) {
          ({$el} = activationRecord.instance);
          classes = new Set();
          _.extend(stateAnimations, {$el, classes});
        }
        
        classes.add(...classNames.trim().split(spaceSplitter));
      });
      
      return animations;
    }, {});
  }
  
  animate() {
    let promises = [];
    
    _.each(this.animations, animationConfigs => {
      let {$el, classes} = animationConfigs;
      let promise = new Promise(resolve => {
        $el.one(animationHandle, () => {
          $el.removeClass(...classes);
          resolve();
        });
      });
      $el.addClass(...classes);
      promises.push(promise);       
    });

    return Promise.all(promises);
  }
}
