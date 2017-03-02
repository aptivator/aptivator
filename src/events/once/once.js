import aptivator from '../../lib/aptivator';

export default (events, callback, context) => {
  aptivator.on(events, callback, context, true);
};
