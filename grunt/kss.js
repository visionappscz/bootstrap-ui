'use strict';

module.exports = {

  options: {
    builder: '<%= paths.temp %>/styleguide/',
  },
  dist: {
    files: [
      {
        styleguide: '<%= paths.src %>/less/',
      },
    ],
  },

};
