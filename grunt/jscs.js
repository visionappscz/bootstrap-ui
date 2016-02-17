'use strict';

module.exports = {

  src: [
    '<%= paths.src %>/js/*.js',
    '<%= paths.src %>/js/tests/unit/*.js',
    '<%= paths.grunt %>/*.js',
    'Gruntfile.js',
  ],
  options: {
    config: '.jscsrc',
  },
};
