'use strict';

module.exports = {

  dist: {
    src: '<%= paths.src %>/js/*.js',
    dest: '<%= paths.temp %>/js/<%= pkg.name %>.js',
    options: {
      banner: '<%= banner %>',
      sourceMap: true,
    },
  },

};
