var aptivator = require('aptivator');
var App2AboutView = require('./about');

aptivator.state('app-2.about', {
  substates: {
    tester: {
      route: 'tester',
      view: App2AboutView,
      parentSelector: '.main',
      parentState: 'app-2'
    }
  },
  
  route: 'about',
  resolves: {
    tester: {
      resolver: function() {
        return 'tester';
      }
    }
  }
});
