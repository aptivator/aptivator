var aptivator = require('aptivator');
var App2FormView = require('./form');
var PlusView = require('./plus');

aptivator.state('app-2.form', {
  route: 'form',
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
        something: function() {
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
