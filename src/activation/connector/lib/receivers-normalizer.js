import _ from 'lodash';

export default receivers => {
  if(_.isArray(receivers)) {
    receivers = _.reduce(receivers, (receivers, receiver) => {
      return _.extend(receivers, {[receiver]: {complete: false}});
    }, {});
  }
  
  return receivers;
};
