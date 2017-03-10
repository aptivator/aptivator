import _         from 'lodash';
import params_   from '../../../lib/params';
import vars      from '../../../lib/vars';

let {spaceSplitter} = vars;

export default params => {
  let {selector, selectorConfigs, stateName, uniqueAddress, stateParams, $el: $parentEl, animations} = params;
  let entityName = stateName || uniqueAddress;
  let selectorAddress = `${selector}@${entityName}@${selector}`;
  let selectorSettingsPath = [entityName, selectorAddress];
  let selectorSettings = _.get(animations, selectorSettingsPath);

  if(!selectorSettings) {
    _.set(animations, selectorSettingsPath, selectorSettings = {$el: $parentEl.find(selector), classes: []});
  }
  
  if(!_.isPlainObject(selectorConfigs)) {
    selectorConfigs = {classes: selectorConfigs};
  }
  
  let {classes: selectorClasses, add, remove} = selectorConfigs;
  
  if(_.isFunction(selectorClasses)) {
    let params = params_.assemble(entityName, stateParams);
    selectorClasses = selectorClasses(params);
  }
  
  if(_.isNull(selectorClasses)) {
    return delete animations[entityName][selectorAddress];
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
