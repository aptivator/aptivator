import _         from 'lodash';
import vars      from '../../../lib/vars';

let {spaceSplitter} = vars;

export default (selector, selectorConfigs, stateName, $parentEl, animations) => {
  let selectorAddress = `${selector}@${stateName}@${selector}`;
  let selectorSettingsPath = [stateName, selectorAddress];
  let selectorSettings = _.get(animations, selectorSettingsPath);

  if(!selectorSettings) {
    _.set(animations, selectorSettingsPath, selectorSettings = {$el: $parentEl.find(selector), classes: []});
  }
  
  if(!_.isObject(selectorConfigs)) {
    selectorConfigs = {classes: selectorConfigs};
  }
  
  let {classes: selectorClasses, add, remove} = selectorConfigs;
  
  if(_.isNull(selectorClasses)) {
    return delete animations[stateName][selectorAddress];
  }
  
  if(_.isString(selectorClasses)) {
    selectorClasses = selectorClasses.trim().split(spaceSplitter);
  }
  
  let {classes} = selectorSettings;
  
  if(add) {
    classes.push(...selectorClasses);
  } else if(remove) {
    _.remove(classes, klass => selectorClasses.includes(klass));
  } else {
    classes.splice(0, classes.length, ...selectorClasses);
  }
};
