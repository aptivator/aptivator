import aptivator           from '../../lib/instance';
import utils               from '../../lib/utils';
import queueChecker        from './queue-checker/queue-checker';
import rootViewBuilder     from './root-view-builder/root-view-builder';
import invalidRouteHandler from './invalid-route-handler/invalid-route-handler';
import starter             from './starter/starter';

aptivator.start = () => {
  utils.waterfall([
    queueChecker,
    rootViewBuilder,
    invalidRouteHandler
  ], starter);
};
