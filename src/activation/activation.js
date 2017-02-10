import _            from 'lodash';
import aptivator    from '../lib/instance';
import canceler     from './canceler/canceler';
import eventer      from './eventer/eventer';
import initializer  from './initializer/initializer';
import preprocessor from './preprocessor/preprocessor';
import registrar    from './registrar/registrar';
import resolver     from './resolver/resolver';
import deactivator  from './deactivator/deactivator';
import renderer     from './renderer/renderer';
import connector    from './connector/connector';
import displayer    from './displayer/displayer';
import finalizer    from './finalizer/finalizer';
import errorer      from './errorer/errorer'; 

aptivator.activate = stateParams => 
  registrar(stateParams)
    .then(canceler)
    .then(initializer)
    .then(eventer('started'))
    .then(canceler)
    .then(preprocessor)
    .then(canceler)
    .then(resolver)
    .then(canceler)
    .then(eventer('loading'))
    .then(deactivator)
    .then(canceler)
    .then(renderer)
    .then(canceler)
    .then(connector)
    .then(canceler)
    .then(displayer)
    .then(eventer('loaded'))
    .then(canceler)
    .then(eventer('entered'))
    .then(finalizer)
    .catch(_.partial(errorer, _, stateParams));
