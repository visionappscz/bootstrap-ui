'use strict';

module.exports = {

  options: {
    template: {
      src: '<%= paths.temp %>/styleguide'
    },
    framework: {
      name: 'kss'
    }
  },
  all: {
    files: [{
      'styleguide': '<%= paths.src %>/less/dist.less'
    }]
  }

};
