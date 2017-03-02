var aptivator = require('aptivator');
var MessageView = require('./message');
var LoadingView = require('../../../loading/loading');

aptivator.state('app-2.form.message', {
  animate: {
    enter: {
      self: 'aptivator-fade-in'
    },
    exit: {
      self: 'aptivator-fade-out'
    }
  },
  states: ['app-2.form'],
  views: {
    '.message': {
      view: MessageView,
      main: true
    },
    '.extra@root': {
      view: LoadingView
    }
  }
});
