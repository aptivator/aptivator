import _            from 'lodash';
import aptivator    from '../libs/instance';
import utils        from '../libs/utils';
import initializer  from './activation/initializer/initializer';
import preprocessor from './activation/preprocessor/preprocessor';
import resolver     from './activation/resolver/resolver';
import renderer     from './activation/renderer/renderer';
import finalizer    from './activation/finalizer/finalizer';

aptivator.activate = (stateParams = {}) => {
  utils.waterfall([
    _.partial(initializer, _, stateParams),
    _.partial(preprocessor, _, stateParams),
    _.partial(resolver, _, stateParams),
    _.partial(renderer, _, stateParams)
  ], _.partial(finalizer, _, stateParams));
};
