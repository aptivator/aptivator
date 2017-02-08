import aptivator           from '../lib/instance';
import error               from '../lib/error';
import queueChecker        from './queue-checker/queue-checker';
import rootViewBuilder     from './root-view-builder/root-view-builder';
import starter             from './starter/starter';

aptivator.start = () =>
  queueChecker()
    .then(rootViewBuilder)
    .then(starter)
    .catch(error.errorer);
