import _            from 'lodash';
import aptivator    from '../lib/aptivator';
import canceler     from './canceler/canceler';
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

let processes = [
  initializer, 
  eventer('start'), 
  preprocessor, 
  resolver, 
  eventer('loading'), 
  deactivator, 
  renderer, 
  connector, 
  displayer, 
  eventer('loaded'), 
  finalizer, 
  eventer('enter')
];

processes = processes.map(process => {
  return stateParams => {
    if(!stateParams) {
      return;
    }
    
    canceler(stateParams);
    return process(stateParams);
  };
});

aptivator.activate = stateParams => {
  let promise = starter(stateParams);
  _.each(processes, process => promise = promise.then(process));
  return promise.catch(errorer);
};
