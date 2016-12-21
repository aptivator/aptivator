import aptivator from '../../../../lib/instance';

export default ['href'].reduce((o, methodName) => 
  (o[methodName] = aptivator[methodName].bind(aptivator), o), {});
