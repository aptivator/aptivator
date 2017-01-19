import $                   from 'jquery';
import invalidRouteHandler from './lib/invalid-route-handler';

export default () => 
  $(() => setTimeout(() => {
    invalidRouteHandler();
    $(window).on('hashchange', invalidRouteHandler);
  }));
