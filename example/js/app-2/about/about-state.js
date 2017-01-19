var aptivator = require('aptivator');
var App2AboutView = require('./about');

aptivator.state('app-2.about', {
  route: 'about',
  view: App2AboutView,
  parentSelector: '.main'
});
