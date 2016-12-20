var Marionette = require('backbone.marionette');
var plusTpl    = require('./plus.tpl');

module.exports = Marionette.ItemView.extend({
  template: plusTpl,
  
  serializeData: function() {
    return {random: Math.random()};
  }
});
