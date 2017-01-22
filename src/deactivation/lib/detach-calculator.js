import _ from 'lodash';

export default (detachSpecific, detachFull) => 
  _.isUndefined(detachSpecific) && detachFull || detachSpecific;