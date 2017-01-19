require('../styles/main.less');
require('./config/config');
require('./root/root-state');
require('./extra/extra-state');
require('./app-1/app-1-state');
require('./header/header-state');
require('./app-2/app-2-state');
require('./error/error-state');
require('./loading/loading-state');
require('./hybrid/hybrid-state');

require('aptivator').start();
