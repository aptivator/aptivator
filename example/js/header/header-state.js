var aptivator = require('aptivator');
var HeaderView = require('./header');

aptivator.state('header', {
  view: HeaderView,
  parentSelector: '.header',
  animate: {
    //enter: 'border-blue'
  },
  resolves: {
    another: function() {
      return 'another';
    }
  },
  data: {
    links: {
      'app-1': 'Application 1',
      'app-2.info': 'Application 2'
    }
  }
});
