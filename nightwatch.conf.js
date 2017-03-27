var seleniumPath = './node_modules/nightwatch/bin/selenium.jar';
var phantomPath = './node_modules/phantomjs-prebuilt/bin/phantomjs';

module.exports = {
  'src_folders': ['./test/unit'],
  'output_folder': false,
  'selenium': {
    'start_process': true,
    'server_path': seleniumPath,
    'host': '127.0.0.1',
    'port': 4444
  },
  'test_settings': {
    'unit': {
      'globals': {
        'asyncHookTimeout': 3000,
      },
      'selenium': {
        'start_process': false,
        'start_session': false
      },
      'filter': './test/unit/**/*.js'
    },
    'ui': {
      'globals': {
        'waitForConditionTimeout': 10000
      },
      'desiredCapabilities': {
        'browserName': 'phantomjs',
        'javascriptEnabled': true,
        'phantomjs.binary.path': phantomPath,
      },
      'filter': './test/ui/**/*.js'
    }
  }
};
