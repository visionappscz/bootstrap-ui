'use strict';

module.exports = {

  // Testing
  // =======

  'test-js': [
    'jscs',
    'jshint',
    'qunit',
  ],

  test: [
    'test-js',
  ],

  // Run JS tests in a real browser.
  // NOTE: add `src/js/tests/` to URL (typically localhost:3000) to view the test page.
  // To access the tests from a remote device that is connected to local network (mobile, tablet,
  // etc.), visit
  // `http://<your local IP address>:3000/src/js/tests/`.
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
