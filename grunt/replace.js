'use strict';

module.exports = {

  styleguide: {
    src: '<%= paths.src %>/styleguide/index.hbs',
    dest: '<%= paths.temp %>/styleguide/index.hbs',
    replacements: [
      {
        from: '%VERSION%',
        to: '<%= pkg.version %>',
      },
      {
        from: '%YEAR%',
        to: '<%= grunt.template.today("yyyy") %>',
      },
    ],
  },

};
