import $                   from 'jquery';
import invalidRouteHandler from './lib/invalid-route-handler';

export default () => 
  new Promise(resolve => {
    $(() => setTimeout(() => {
      invalidRouteHandler();
      $(window).on('hashchange', invalidRouteHandler);
    }));
    
    resolve();
  });
