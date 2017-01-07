import _            from 'lodash';
import aptivator    from '../../lib/instance';
import initializer  from './initializer/initializer';
import preprocessor from './preprocessor/preprocessor';
import resolver     from './resolver/resolver';
import deactivator  from './deactivator/deactivator';
import renderer     from './renderer/renderer';
import finalizer    from './finalizer/finalizer';
import errorer      from './errorer/errorer'; 

aptivator.activate = (stateParams = {}) =>
  new Promise((resolve, reject) => 
    initializer(stateParams)
      .then(preprocessor)
      .then(resolver)
      .then(deactivator)
      .then(renderer)
      .then(finalizer)
      .then(resolve)
      .catch(_.partial(errorer, _, reject)));
