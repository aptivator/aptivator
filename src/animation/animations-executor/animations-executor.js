import $                from 'jquery';
import _                from 'lodash';
import stylesAggregator from './styles-aggregator/styles-aggregator';

export default animations => {
  let allPromises = [];
  
  _.each(animations, animationConfigs => {
    let {$el, classes} = animationConfigs;
    let elementsPromises = [];

    _.each($el, el => {
      let $el = $(el);
      let css = ['animation', 'transition'].reduce((css, property) => {
        css[property] = stylesAggregator(el, property);
        return css;
      }, {});
      
      $el.addClass(...classes);
      
      _.each(css, (css, property) => {
        if(css !== stylesAggregator(el, property)) {
          let promise = new Promise(resolve => $el.one(`${property}end`, resolve));
          elementsPromises.push(promise);
        }
      });
    });
    
    allPromises.push(Promise.all(elementsPromises).then(() => $el.removeClass(...classes)));
  });

  return Promise.all(allPromises);  
};
