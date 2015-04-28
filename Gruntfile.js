'use strict';

module.exports = function (grunt) {

  var options = {
    pkg: grunt.file.readJSON('package.json'),

    paths: {
      src: 'src',
      dist: 'dist',
      bower: 'bower_components',
      styleguide: 'styleguide',
      temp: '.tmp'
    },

    // Banner for distribution CSS and JS
    banner: '/*!\n' +
    ' * Synergic UI\n' +
    ' * Built on the shoulders of a giant: Bootstrap 3\n' +
    ' * <%= pkg.homepage %>\n' +
    ' *\n' +
    ' * Created by <%= pkg.author %> (www.synergic.cz)\n' +
    ' * HTML & LESS © Adam Kudrna, 2014—2015\n' +
    ' * JavaScript © Martin Bohal, 2014—2015\n' +
    ' *\n' +
    ' * v<%= pkg.version %> (<%= grunt.template.today("d mmmm yyyy") %>)\n' +
    ' */\n'
  };

  require('time-grunt')(grunt);

  require('load-grunt-config')(grunt, { config: options });

  // See the `grunt/` directory for individual task configurations.
};
