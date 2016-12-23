var aptivator = require('aptivator');
var App2FormView = require('./form');
var PlusView = require('./plus');

aptivator.state('app-2.form', {
  route: 'form/:two',
  routeValues: [2],
  resolve: {
    main: function() {
      return 'main';
    }
  },
  views: {
    main: {
      view: App2FormView
    },
    'plus@app-2.form': {
      view: PlusView,
      resolve: {
        something: function(p) {
          return 'something';
        },
        random: {
          resolver: function() {
            return Math.random();
          },
          persist: false,
          store: true
        }
      }
    }
  }
});
