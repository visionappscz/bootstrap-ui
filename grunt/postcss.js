'use strict';

module.exports = {

  core: {
    options: {
      processors: [
        require('autoprefixer')(),
      ],
    },
    src: '<%= paths.temp %>/css/<%= pkg.name %>.css',
  },
  'core-min': {
    options: {
      processors: [
        require('cssnano')({
          autoprefixer: false,
          mergeRules: false,
          zindex: false,
        }),
      ],
    },
    src: '<%= paths.temp %>/css/<%= pkg.name %>.css',
    dest: '<%= paths.temp %>/css/<%= pkg.name %>.min.css',
  },
  styleguide: {
    options: {
      processors: [
        require('autoprefixer')(),
        require('cssnano')({
          autoprefixer: false,
          mergeRules: false,
          zindex: false,
        }),
      ],
    },
    src: '<%= paths.temp %>/styleguide/kss.css',
    dest: '<%= paths.styleguide %>/kss-assets/css/kss.min.css',
  },

};
