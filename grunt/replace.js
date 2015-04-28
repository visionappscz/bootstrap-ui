'use strict';

module.exports = {

  styleguide: {
    src: '<%= paths.src %>/styleguide/index.html',
    dest: '<%= paths.temp %>/styleguide/index.html',
    replacements: [
      {
        from: '%VERSION%',
        to: '<%= pkg.version %>'
      },
      {
        from: '%YEAR%',
        to: '<%= grunt.template.today("yyyy") %>'
      }
    ]
  }

};
