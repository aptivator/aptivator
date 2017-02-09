import _ from 'lodash';

let animationStylesToEvents = {
  'animation': 'animationend',
  'OAnimation': 'oAnimationEnd',
  'MozAnimation': 'animationend',
  'WebkitAnimation': 'webkitAnimationEnd'
};

let transitionStylesToEvents = {
  'transition': 'transitionend',
  'OTransition': 'oTransitionEnd',
  'MozTransition': 'transitionend',
  'WebkitTransition': 'webkitTransitionEnd'
};

let stylesToEvents = [animationStylesToEvents, transitionStylesToEvents];

let el = document.createElement('someElement');

export default stylesToEvents.reduce((eventNames, stylesToEvents) => {
  for(let [styleProperty, eventName] of _.entries(stylesToEvents)) {
    if(!_.isUndefined(el.style[styleProperty])) {
      eventNames.push(eventName);
      break;
    }
  }
  return eventNames;
}, []);
