var Marionette = require('backbone.marionette');
var mainTpl = require('./main.tpl');

module.exports = Marionette.LayoutView.extend({
  template: mainTpl,
  regions: {
    extra: '#extra',
    error: '#error',
    intermediate: '#intermediate',
    header: '#header',
    main: '#main',
    interactive: '#interactive'
  }
});
