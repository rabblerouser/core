module.exports = (
  function conf(settings) {
    settings.selenium = {
      start_process: true,
      server_path: 'bin/selenium-server-standalone-2.53.1.jar',
      log_path: '',
      port: 4444,
      cli_args: {
        'webdriver.chrome.driver': process.env.CHROME_DRIVER,
      },
    };
    return settings;
  }(require('./nightwatch.json')));
