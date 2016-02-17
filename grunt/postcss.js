'use strict';

module.exports = {

  core: {
    options: {
      processors: [
        require('autoprefixer')()
      ]
    },
    src: '<%= paths.temp %>/css/<%= pkg.name %>.css'
  },
  'core-min': {
    options: {
      processors: [
        require('cssnano')()
      ]
    },
    src: '<%= paths.temp %>/css/<%= pkg.name %>.css',
    dest: '<%= paths.temp %>/css/<%= pkg.name %>.min.css'
  },
  styleguide: {
    options: {
      processors: [
        require('autoprefixer')()
      ]
    },
    src: '<%= paths.styleguide %>/public/kss.css'
  }

};
