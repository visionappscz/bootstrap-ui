'use strict';

module.exports = {

  options: {
    preserveComments: 'some',
  },
  dist: {
    files: {
      '<%= paths.temp %>/js/<%= pkg.name %>.min.js': '<%= paths.temp %>/js/<%= pkg.name %>.js',
    },
  },

};
