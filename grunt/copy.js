'use strict';

module.exports = {

  dist: {
    files: [
      {
        expand: true,
        cwd: '<%= paths.temp %>/',
        src: ['css/*', 'js/*'],
        dest: '<%= paths.dist %>/',
      },
    ],
  },
  fonts: {
    files: [
      {
        expand: true,
        cwd: '<%= paths.bower %>/bootstrap/dist/',
        src: ['fonts/*'],
        dest: '<%= paths.dist %>/',
      },
    ],
  },
  styleguide: {
    files: [
      {
        expand: true,
        flatten: true,
        src: [
          '<%= paths.bower %>/jquery/dist/jquery.min.*',
          '<%= paths.bower %>/eonasdan-bootstrap-datetimepicker/build/js/*',
          '<%= paths.bower %>/moment/min/moment-with-locales.min.js',
          '<%= paths.bower %>/select2/select2.min.js',
        ],
        dest: '<%= paths.styleguide %>/assets/js/',
      },
      {
        expand: true,
        cwd: '<%= paths.bower %>/bootstrap/dist/',
        src: ['fonts/*', 'js/*'],
        dest: '<%= paths.styleguide %>/assets/',
      },
      {
        expand: true,
        cwd: '<%= paths.temp %>/',
        src: ['css/*', 'js/*'],
        dest: '<%= paths.styleguide %>/assets/',
      },
      {
        expand: true,
        cwd: '<%= paths.src %>/images/',
        src: ['*'],
        dest: '<%= paths.styleguide %>/assets/images/',
      },
      {
        expand: true,
        cwd: '<%= paths.src %>/styleguide/kss-assets/js/',
        src: ['*'],
        dest: '<%= paths.styleguide %>/kss-assets/js/',
      },
      {
        expand: true,
        cwd: '<%= paths.bower %>/',
        src: ['ckeditor/**/*'],
        dest: '<%= paths.styleguide %>/assets/vendor/',
      },
    ],
  },

};
