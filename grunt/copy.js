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
        cwd: '<%= paths.npm %>/bootstrap/dist/',
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
          '<%= paths.npm %>/jquery/dist/jquery.min.*',
          '<%= paths.npm %>/eonasdan-bootstrap-datetimepicker/build/js/*',
          '<%= paths.npm %>/moment/min/moment-with-locales.min.js',
          '<%= paths.npm %>/select2/select2.js',
        ],
        dest: '<%= paths.styleguide %>/assets/js/',
      },
      {
        expand: true,
        cwd: '<%= paths.npm %>/bootstrap/dist/',
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
        cwd: '<%= paths.src %>/docs/kss-assets/js/',
        src: ['*'],
        dest: '<%= paths.styleguide %>/kss-assets/js/',
      },
      {
        expand: true,
        cwd: '<%= paths.npm %>/',
        src: ['ckeditor/**/*'],
        dest: '<%= paths.styleguide %>/assets/vendor/',
      },
    ],
  },

};
