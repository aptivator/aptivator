var aptivator = require('aptivator');
var MessageView = require('./message');

aptivator.state('app-2.form.message', {
  view: MessageView,
  parentSelector: '.message'
});
