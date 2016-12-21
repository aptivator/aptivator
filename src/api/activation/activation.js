import _            from 'lodash';
import aptivator    from '../../lib/instance';
import utils        from '../../lib/utils';
import initializer  from './initializer/initializer';
import preprocessor from './preprocessor/preprocessor';
import resolver     from './resolver/resolver';
import renderer     from './renderer/renderer';
import finalizer    from './finalizer/finalizer';

aptivator.activate = (stateParams = {}) => {
  utils.waterfall([
    _.partial(initializer, _, stateParams),
    _.partial(preprocessor, _, stateParams),
    _.partial(resolver, _, stateParams),
    _.partial(renderer, _, stateParams)
  ], _.partial(finalizer, _, stateParams));
};
