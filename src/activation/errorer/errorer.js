import hooksFactory from '../hooks/hooks-factory';

let errorHook = hooksFactory('error');

export default async (e, stateParams) => {
  if(!(e instanceof Error)) {
    await errorHook(stateParams);
  }
  
  console.error(e);
  throw e;
};
