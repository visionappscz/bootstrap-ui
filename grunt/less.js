'use strict';

module.exports = {

  core: {
    options: {
      banner: '<%= banner %>',
      modifyVars: { 'external-components-path': '"node_modules/"' },
      strictUnits: true,
      sourceMap: true,
      sourceMapFilename: '<%= paths.temp %>/css/<%= pkg.name %>.css.map',
      sourceMapURL: '<%= pkg.name %>.css.map',
      sourceMapRootpath: '../../../',
    },
    files: {
      '<%= paths.temp %>/css/<%= pkg.name %>.css': '<%= paths.src %>/less/<%= pkg.name %>.less',
    },
  },
  styleguide: {
    options: {
      paths: ['<%= paths.npm %>'],
      strictUnits: true,
    },
    files: {
      '<%= paths.temp %>/docs/kss.css':
        '<%= paths.src %>/docs/kss-assets/less/kss.less',
    },
  },

};
