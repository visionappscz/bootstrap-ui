'use strict';

module.exports = {

  temp: '<%= paths.temp %>',
  dist: '<%= paths.dist %>',
  styleguide: [
    '<%= paths.styleguide %>/*',
    '!<%= paths.styleguide %>/.nojekyll',
    '!<%= paths.styleguide %>/CNAME',
  ],

};
