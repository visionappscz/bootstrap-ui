'use strict';

module.exports = {

  options: {
    builder: '<%= paths.temp %>/docs/',
  },
  dist: {
    src: ['<%= paths.src %>/less/'],
    dest: '<%= paths.styleguide %>',
  },

};
