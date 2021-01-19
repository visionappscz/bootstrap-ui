'use strict';

module.exports = {

  styleguide: {
    src: '<%= paths.src %>/docs/index.hbs',
    dest: '<%= paths.temp %>/docs/index.hbs',
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
