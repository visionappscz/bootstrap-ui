'use strict';

module.exports = {

  options: {
    builder: '<%= paths.temp %>/styleguide/',
    verbose: true,
  },
  dist: {
    files: [
      {
        styleguide: '<%= paths.src %>/less/',
      },
    ],
  },

};
