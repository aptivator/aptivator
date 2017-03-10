var Marionette = require('backbone.marionette');
var messageTpl = require('./message.tpl');

module.exports = Marionette.ItemView.extend({
  template: messageTpl,
  
  events: {
    'click .remove': 'remover'
  },
  
  remover: function() {
    this.destroy({animate: true});
    return false;
  }
});
