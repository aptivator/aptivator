import _            from 'lodash';
import aptivator    from '../lib/instance';
import initializer  from './initializer/initializer';
import preprocessor from './preprocessor/preprocessor';
import historian    from './historian/historian';
import resolver     from './resolver/resolver';
import deactivator  from './deactivator/deactivator';
import renderer     from './renderer/renderer';
import connector    from './connector/connector';
import displayer    from './displayer/displayer';
import finalizer    from './finalizer/finalizer';
import errorer      from './errorer/errorer'; 

aptivator.activate = stateParams => 
  historian(stateParams)
    .then(initializer)
    .then(preprocessor)
    .then(resolver)
    .then(deactivator)
    .then(renderer)
    .then(connector)
    .then(displayer)
    .then(finalizer)
    .catch(_.partial(errorer, _, stateParams));
