var aptivator = require('aptivator');

aptivator.on({
  start: function() {
    
  }
});

aptivator.on({
  start: [function() {
    
  }, function() {
    
  }]
});

aptivator.on({
  start: {
    callbacks: function() {
      
    },
    sub: {
      
    }
  }
});

aptivator.on({
  start: {
    callbacks: [() => {
      
    }],
    sub: {
      'app-1': []
    }
  },
  
  error: {
    callbacks: [],
    sub: {
      'cancel': {
        callbacks: [],
        sub: {
          'app-1': []
        }
      }
    }
  }
});

aptivator.off({
  start: []
});

aptivator.trigger({
  start: {
    'app-1': null
  }
}, {focal: true});

aptivator.trigger('error:logged-out:app-1', 'arg1', 'arg2');
