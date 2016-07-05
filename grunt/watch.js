'use strict';

module.exports = {

  less: {
    files: ['<%= paths.src %>/less/**/*.less'],
    tasks: [
      'build-css',
      'build-styleguide',
    ],
  },
  js: {
    files: ['<%= paths.src %>/js/*.js'],
    tasks: [
      'jscs',
      'jshint',
      'build-js',
      'build-styleguide',
    ],
  },
  styleguide: {
    files: [
      '<%= paths.src %>/less/homepage.md',
      '<%= paths.src %>/styleguide/**/*',
    ],
    tasks: [
      'build-styleguide',
    ],
  },

};
