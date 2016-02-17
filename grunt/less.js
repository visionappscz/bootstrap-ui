'use strict';

module.exports = {

  dist: {
    files: {
      '<%= paths.temp %>/css/<%= pkg.name %>.css': '<%= paths.src %>/less/dist.less',
    },
    options: {
      banner: '<%= banner %>',
      strictUnits: true,
      sourceMap: true,
      sourceMapFilename: '<%= paths.temp %>/css/<%= pkg.name %>.css.map',
      sourceMapURL: '<%= pkg.name %>.css.map',
      sourceMapRootpath: '../../../',
    },
  },

};
