import aptivator    from '../../lib/instance';
import error        from '../../lib/error';
import initializer  from './initializer/initializer';
import preprocessor from './preprocessor/preprocessor';
import resolver     from './resolver/resolver';
import renderer     from './renderer/renderer';
import finalizer    from './finalizer/finalizer';

aptivator.activate = (stateParams = {}) => 
  initializer(stateParams)
    .then(preprocessor)
    .then(resolver)
    .then(renderer)
    .then(finalizer)
    .catch(error.console);
