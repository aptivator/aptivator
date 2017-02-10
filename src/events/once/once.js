import aptivator from '../../lib/instance';

export default (events, callback, context) => {
  aptivator.on(events, callback, context, true);
};
