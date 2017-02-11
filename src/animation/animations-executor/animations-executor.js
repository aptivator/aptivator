import $ from 'jquery';
import _ from 'lodash';

let animationProperties = ['animation', 'transition'];

let animationMap = animationProperties.reduce((animationMap, animationProperty) => {
  animationMap[animationProperty] = {eventName: `${animationProperty}end`};
  return animationMap;
}, {});

export default animations => {
  let allPromises = [];
  
  _.each(animations, animationConfigs => {
    let {$el, classes} = animationConfigs;
    let elementsPromises = [];

    _.each(animationMap, (settings, animationProperty) => {
      settings.initial = _.map($el, el => $(el).css(animationProperty));
    });

    $el.addClass(...classes);
    
    _.each(animationMap, (settings, animationProperty) => {
      let {animated, initial, eventName} = settings;
      animated = _.map($el, el => $(el).css(animationProperty));
      
      if(!_.isEqual(animated, initial)) {
        _.each($el, el => {
          let promise = new Promise(resolve => $(el).one(eventName, resolve));
          elementsPromises.push(promise);
        });
      }
    });

    allPromises.push(Promise.all(elementsPromises).then(() => $el.removeClass(...classes)));       
  });

  return Promise.all(allPromises);  
};
