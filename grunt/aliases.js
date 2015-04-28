'use strict';

module.exports = {

  // Individual build tasks
  'build-css': [
    'less',
    'autoprefixer:core',
    'cssmin'
  ],

  'build-js': [
    'jshint:core',
    'concat',
    'uglify'
  ],

  'build-styleguide': [
    'replace:styleguide',
    'copy:styleguideSrc',
    'styleguide',
    'autoprefixer:styleguide',
    'copy:styleguide'
  ],

  // Build CSS, JS and style guide.
  'build': [
    'clean:temp',
    'clean:styleguide',
    'build-css',
    'build-js',
    'build-styleguide'
  ],

  // Create distribution package. To be run right before release.
  'dist': [
    'test',
    'clean:dist',
    'build',
    'copy:dist',
    'copy:fonts'
  ],

  // Serve the style guide to browser, watch the source files for changes and update them automatically.
  'serve': [
    'build',
    'browserSync:dev',
    'watch'
  ],

  // Run JS tests in a headless browser.
  'test':[
    'jshint',
    'qunit'
  ],

  // Run JS tests in a real browser.
  // NOTE: add `src/js/tests/` to URL (typically localhost:3000) to view the test page.
  // To access the tests from a remote device that is connected to local network (mobile, tablet, etc.), visit
  // `http://<your local IP address>:3000/src/js/tests/`.
  'test-remote': [
    'jshint',
    'browserSync:test'
  ],

  // Default task
  'default': 'test'

};
