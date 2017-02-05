import _            from 'lodash';
import aptivator    from '../lib/instance';
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
import eventLinker  from './event-linker/event-linker';

aptivator.activate = stateParams => 
  registrar(stateParams)
    .then(initializer)
    .then(eventLinker('start'))
    .then(preprocessor)
    .then(resolver)
    .then(eventLinker('loading'))
    .then(deactivator)
    .then(renderer)
    .then(connector)
    .then(displayer)
    .then(eventLinker('loaded'))
    .then(eventLinker('enter'))
    .then(finalizer)
    .catch(_.partial(errorer, _, stateParams));
