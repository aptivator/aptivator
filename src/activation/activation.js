import aptivator    from '../lib/instance';
import eventer      from './eventer/eventer';
import initializer  from './initializer/initializer';
import preprocessor from './preprocessor/preprocessor';
import starter      from './starter/starter';
import resolver     from './resolver/resolver';
import deactivator  from './deactivator/deactivator';
import renderer     from './renderer/renderer';
import connector    from './connector/connector';
import displayer    from './displayer/displayer';
import finalizer    from './finalizer/finalizer';
import errorer      from '../errorer/errorer'; 

aptivator.activate = stateParams => 
  starter(stateParams)
    .then(initializer)
    .then(eventer('start'))
    .then(preprocessor)
    .then(resolver)
    .then(eventer('loading'))
    .then(deactivator)
    .then(renderer)
    .then(connector)
    .then(displayer)
    .then(eventer('loaded'))
    .then(eventer('enter'))
    .then(finalizer)
    .catch(errorer);
