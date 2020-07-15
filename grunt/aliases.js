'use strict';

module.exports = {

  // Testing
  // =======

  'test-js': [
    'jscs',
    'jshint',
    'karma',
  ],

  test: [
    'test-js',
  ],

  'test-remote': [
    'jscs',
    'jshint',
    'browserSync:test',
  ],

  // Build
  // =====

  'build-css': [
    'less:core',
    'postcss:core',
    'postcss:core-min',
  ],

  'build-js': [
    'concat',
    'uglify',
  ],

  'build-styleguide': [
    'replace:styleguide',
    'less:styleguide',
    'postcss:styleguide',
    'copy:styleguide',
    'kss',
  ],

  // Build CSS, JS and style guide.
  build: [
    'clean:temp',
    'clean:styleguide',
    'build-css',
    'build-js',
    'build-styleguide',
  ],

  // Create distribution package. To be run right before release.
  dist: [
    'test',
    'clean:dist',
    'build',
    'copy:dist',
    'copy:fonts',
  ],

  // Development
  // ===========

  // Serve the style guide to browser, watch the source files for changes and update them
  // automatically.
  serve: [
    'test',
    'build',
    'browserSync:dev',
    'watch',
  ],

  // Default task
  // ============

  default: [
    'test',
    'build',
  ],
};
