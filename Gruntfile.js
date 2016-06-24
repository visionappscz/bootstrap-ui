'use strict';

module.exports = function (grunt) {

  var options = {
    pkg: grunt.file.readJSON('package.json'),

    paths: {
      bower: 'bower_components',
      dist: 'dist',
      grunt: 'grunt',
      src: 'src',
      styleguide: 'styleguide',
      temp: '.tmp',
    },

    // Banner for distribution CSS and JS
    banner: '/*!\n' +
    ' * Bootstrap UI\n' +
    ' * Built on the shoulders of a giant: Bootstrap 3\n' +
    ' * <%= pkg.homepage %>\n' +
    ' *\n' +
    ' * Created by <%= pkg.author %> (www.visionapps.cz)\n' +
    ' *\n' +
    ' * v<%= pkg.version %> (<%= grunt.template.today("d mmmm yyyy") %>)\n' +
    ' */\n',

    devBrowser: 'google chrome',
  };

  require('time-grunt')(grunt);

  require('load-grunt-config')(grunt, { config: options });

  // See the `grunt/` directory for individual task configurations.
};
