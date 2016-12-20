var Marionette = require('backbone.marionette');
var app2Tpl = require('./app-2.tpl');

module.exports = Marionette.LayoutView.extend({
  template: app2Tpl,
  regions: {
    main: '#app-2 .main'
  }
});
