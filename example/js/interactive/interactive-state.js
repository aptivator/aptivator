var _ = require('underscore');
var aptivator = require('aptivator');
var mainTpl = require('./main/main.tpl');
var Selector = require('./selector/selector');
var Selector1 = require('./selector-1/selector');
var Displayer = require('./displayer/displayer');
var Displayer1 = require('./displayer-1/displayer');

aptivator.state('interactive', {
  route: {
    path: 'interactive/:one/*splat',
    params: {
      one: {
        value: 'one'
      },
      splat: {
        value: '22'
      }
    }
  },
  states: ['header'],
  views: {
    '.interactive': {
      template: mainTpl,
      main: true
    },
    
    '.selector@interactive': {
      view: Selector,
      data: {
        selects: {
          '': '',
          'val1': 'Value 1',
          'val2': 'Value 2'
        }
      },
      
      deps: {
        views: {
          '.selector@interactive': {
            intercept: {
              'keyup #keyup': {
                storeAs: 'keyup',
                debounce: 300,
                receivers: ['keyupReceiver']
              },
              'keyupReceiver': {
                storeAs: 'stringified',
                receivers: ['stringified']
              }
            }
          },

          'datacleaner@interactive': {
            intercept: {
              gathered: {
                storeAs: 'gathered',
                receivers: ['disableForm']
              }
            }
          },
          
          'formsender@interactive': {
            intercept: {
              sender: {
                storeAs: 'sent',
                receivers: ['enableForm']
              }
            }
          }
        }
      }
    },
    
    '.selector1@interactive': {
      view: Selector1,
      resolves: {
        selects: function() {
          return {
            '': '',
            'another': 'Another',
            'plus': 'Plus'
          };
        }
      },

      deps: {
        views: {
          'datacleaner@interactive': {
            intercept: {
              gathered: {
                storeAs: 'gathered',
                receivers: ['disableForm']
              }
            }
          },
          
          'formsender@interactive': {
            intercept: {
              sender: {
                storeAs: 'sent',
                receivers: ['enableForm']
              }
            }
          }
        }
      }
    },
    
    '.displayer@interactive': {
      view: Displayer,
      deps: {
        views: {
          '.selector@interactive': {
            intercept: {
              'change #selector': {
                storeAs: 'val1',
                receivers: ['dependency']
              }
            }
          }
        }
      }
    },
    
    '.displayer1@interactive': {
      view: Displayer1,
      deps: {
        views: {
          '.selector1@interactive': {
            intercept: {
              'change .selector': {
                storeAs: 'val1',
                receivers: ['dependency']
              }
            }
          }
        }
      }
    },
    
    'datacleaner@interactive': {
      view: (function() {
        function DataCleaner(params) {
          this.params = params;
        }
        _.extend(DataCleaner.prototype, {
          
          gathered: function(data) {
            return data;
          },
          
          processor: function(data) {
            return new Promise(function(resolve, reject) {
              setTimeout(function() {
                resolve(JSON.stringify(data['gathered']));
              }, 3000);
            });
          }
        });
        return DataCleaner;
      })(),
      
      deps: {
        receivers: {
          'gathered': {
            complete: true
          }
        },
        views: {
          '.selector@interactive': {
            intercept: {
              'change #selector': {
                storeAs: 'val1'
              },
              'stringified': {
                storeAs: 'keyup'
              }
            }
          },
          '.selector1@interactive': {
            intercept: {
              'change .selector': {
                storeAs: 'val2'
              }
            }
          },
          'datacleaner@interactive': {
            intercept: {
              'gathered': {
                storeAs: 'gathered',
                receivers: ['processor'],
                local: true
              }
            }
          }
        }
      }
    },
    
    'formsender@interactive': {
      view: (function() {
        function FormSender(params) {
          this.params = params;
        }  
        _.extend(FormSender.prototype, {
          sender: function(data) {
            console.log(data['stringified']);
          }
        });
        return FormSender;
      })(),
      deps: {
        receivers: ['sender'],
        views: {
          'datacleaner@interactive': {
            intercept: {
              'processor': {
                storeAs: 'stringified'
              }
            }
          }
        }
      }
    }
  }
});
