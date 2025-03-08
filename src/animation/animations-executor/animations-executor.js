import $                from 'jquery';
import _                from 'lodash';
import stylesAggregator from './lib/styles-aggregator';

export default animations => {
  let allPromises = [];
  let activatedClasses = [];
  
  _.each(animations, views => {
    _.each(views, (animationConfigs, viewHash) => {
      let {$el, classes} = animationConfigs;
      let elementsPromises = [];
      classes = classes.join(' ');
  
      _.each($el, el => {
        let $el = $(el);
        let css = ['animation', 'transition'].reduce((css, property) => {
          css[property] = stylesAggregator(el, property);
          return css;
        }, {});
        
        $el.addClass(classes);
        activatedClasses.push([$el, classes]);
        
        _.each(css, (css, property) => {
          if(css !== stylesAggregator(el, property)) {
            let promise = new Promise(resolve => $el.one(`${property}end`, resolve));
            elementsPromises.push(promise);
          }
        });
      });
      
      allPromises.push(Promise.all(elementsPromises));
    });
  });

  return Promise.all(allPromises).then(() => {
    for(let [$el, classes] of activatedClasses) {
      $el.removeClass(classes);
    }
  });
};
