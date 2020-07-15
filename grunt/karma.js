'use strict';

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = {
  unit: {
    autoWatch: false,
    singleRun: true,

    frameworks: ['mocha', 'chai'],
    files: [
      { pattern: '<%= paths.npm %>/jquery/dist/jquery.js' },
      { pattern: '<%= paths.npm %>/bootstrap/js/modal.js' },
      { pattern: '<%= paths.npm %>/moment/min/moment-with-locales.min.js' },
      { pattern: '<%= paths.npm %>/sinon/pkg/sinon.js' },
      { pattern: '<%= paths.src %>/js/**/*.js' },
    ],
    port: 9999,
    browsers: ['ChromeHeadless'],
  },
};
