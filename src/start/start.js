import aptivator           from '../lib/instance';
import queueChecker        from './lib/queue-checker';
import rootViewBuilder     from './lib/root-view-builder';
import invalidRouteHandler from './lib/invalid-route-handler';
import starter             from './lib/starter';

aptivator.start = () =>
  queueChecker()
    .then(rootViewBuilder)
    .then(invalidRouteHandler)
    .then(starter)
    .catch(console.error.bind(console));
