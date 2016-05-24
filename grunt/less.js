'use strict';

module.exports = {

  core: {
    options: {
      banner: '<%= banner %>',
      strictUnits: true,
      sourceMap: true,
      sourceMapFilename: '<%= paths.temp %>/css/<%= pkg.name %>.css.map',
      sourceMapURL: '<%= pkg.name %>.css.map',
      sourceMapRootpath: '../../../',
    },
    files: {
      '<%= paths.temp %>/css/<%= pkg.name %>.css': '<%= paths.src %>/less/synergic-ui.less',
    },
  },
  styleguide: {
    files: {
      '<%= paths.temp %>/styleguide/kss.css':
        '<%= paths.src %>/styleguide/kss-assets/less/kss.less',
    },
  },

};
