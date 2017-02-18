var aptivator = require('aptivator');
var MessageView = require('./message');
var LoadingView = require('../../../loading/loading');

aptivator.state('app-2.form.message', {
  animate: {
    enter: {
      root: null,
      self: 'aptivator-fade-in'
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
