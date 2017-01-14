import _            from 'lodash';
import aptivator    from '../lib/instance';
import initializer  from './initializer/initializer';
import preprocessor from './preprocessor/preprocessor';
import historian    from './historian/historian';
import resolver     from './resolver/resolver';
import deactivator  from './deactivator/deactivator';
import renderer     from './renderer/renderer';
import finalizer    from './finalizer/finalizer';
import errorer      from './errorer/errorer'; 

aptivator.activate = stateParams => 
  initializer(stateParams)
    .then(preprocessor)
    .then(historian)
    .then(resolver)
    .then(deactivator)
    .then(renderer)
    .then(finalizer)
    .catch(_.partial(errorer, _, stateParams));
