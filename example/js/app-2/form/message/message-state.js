var aptivator = require('aptivator');
var MessageView = require('./message');
var LoadingView = require('../../../loading/loading');

aptivator.state('app-2.form.message', {
  animate: {
    enter: {
      root: null,
      self: 'aptivator-fade-in'
    },
    exit: {
      root: null,
      self: 'aptivator-fade-out'
    }
  },
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
