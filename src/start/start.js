import aptivator           from '../lib/instance';
import error               from '../lib/error';
import queueChecker        from './queue-checker/queue-checker';
import rootViewBuilder     from './root-view-builder/root-view-builder';
import invalidRouteHandler from './invalid-route-handler/invalid-route-handler';
import starter             from './starter/starter';

aptivator.start = () =>
  queueChecker()
    .then(rootViewBuilder)
    .then(invalidRouteHandler)
    .then(starter)
    .catch(error.errorer);
