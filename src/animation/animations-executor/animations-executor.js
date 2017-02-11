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
      settings.initial = _.reduce($el, (initial, el) => {
        let $el = $(el);
        let initialCss = $el.css(animationProperty);
        initial.set($el, initialCss);
        return initial;
      }, new Map());
    });

    $el.addClass(...classes);
    
    _.each(animationMap, (settings, animationProperty) => {
      let {eventName, initial} = settings;
      for(let [$el, initialCss] of initial.entries()) {
        if(initialCss !== $el.css(animationProperty)) {
          let promise = new Promise(resolve => $el.one(eventName, resolve));
          elementsPromises.push(promise);
        }
      }
    });
    
    allPromises.push(Promise.all(elementsPromises).then(() => $el.removeClass(...classes)));
  });

  return Promise.all(allPromises);  
};
