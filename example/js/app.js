require('../styles/main.less');
require('./apps/root/root-state');
require('./apps/extra/extra-state');
require('./apps/app-1/app-1-state');
require('./apps/header/header-state');
require('./apps/app-2/app-2-state');
require('./apps/error/error-state');

require('aptivator').start();
