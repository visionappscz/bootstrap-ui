'use strict';

module.exports = {

  dev: {
    bsFiles: {
      src: [
        '<%= paths.styleguide %>/public/css/*.css',
        '<%= paths.styleguide %>/public/js/*.js',
        '<%= paths.styleguide %>/*.html',
      ],
    },
    options: {
      server: {
        baseDir: './styleguide/',
      },
      browser: '<%= devBrowser %>',
      watchTask: true,
    },
  },
  test: {
    bsFiles: {
      src: [
        '<%= paths.src %>/js/**/*.js',
      ],
    },
    options: {
      server: {
        baseDir: './',
      },
    },
  },

};
