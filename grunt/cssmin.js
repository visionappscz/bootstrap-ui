'use strict';

module.exports = {

  options: {
    restructuring: false
  },
  dist: {
    files: {
      '<%= paths.temp %>/css/<%= pkg.name %>.min.css': '<%= paths.temp %>/css/<%= pkg.name %>.css'
    }
  }

};
