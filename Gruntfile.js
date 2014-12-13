module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    // Load meta info from package.json
    pkg: grunt.file.readJSON('package.json'),

    // Banner for distribution CSS and JS
    banner: '/*!\n' +
      ' * Synergic UI\n' +
      ' * Built on the shoulders of a giant: Bootstrap 3\n' +
      ' * <%= pkg.homepage %>\n' +
      ' *\n' +
      ' * Created by <%= pkg.author %> (www.synergic.cz)\n' +
      ' * HTML & LESS © 2014 Adam Kudrna\n' +
      ' * JavaScript © 2014 Martin Bohal\n' +
      ' *\n' +
      ' * v<%= pkg.version %> (<%= grunt.template.today("d mmmm yyyy") %>)\n' +
      ' */\n',

    // Clean
    clean: {
      temp: '.tmp',
      dist: 'dist',
      styleguide: 'styleguide'
    },

    // Compile LESS
    less: {
      dist: {
        files: {
          '.tmp/css/<%= pkg.name %>.css': 'src/less/dist.less'
        },
        options: {
          banner: '<%= banner %>',
          strictUnits: true,
          sourceMap: true,
          sourceMapFilename: '.tmp/css/<%= pkg.name %>.css.map',
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapRootpath: '../../../'
        }
      }
    },

    // Add vendor prefixes to CSS, based on Bootstrap settings
    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      core: {
        options: {
          map: true
        },
        src: '.tmp/css/<%= pkg.name %>.css'
      },
      styleguide: {
        src: 'styleguide/public/kss.css'
      }
    },

    // Minify CSS
    cssmin: {
      dist: {
        files: {
          '.tmp/css/<%= pkg.name %>.min.css': '.tmp/css/<%= pkg.name %>.css'
        }
      }
    },

    // Lint custom JS
    jshint: {
      grunt: 'Gruntfile.js',
      core: 'src/js/*.js',
      tests: 'src/js/tests/unit/*.js'
    },

    // Concat all JS
    concat: {
      dist: {
        src: 'src/js/*.js',
        dest: '.tmp/js/<%= pkg.name %>.js',
        options: {
          banner: '<%= banner %>',
          sourceMap: true
        }
      }
    },

    // Minify concatenated JS
    uglify: {
      options: {
        preserveComments: 'some'
      },
      dist: {
        files: {
          '.tmp/js/<%= pkg.name %>.min.js': '.tmp/js/<%= pkg.name %>.js'
        }
      }
    },

    // Replace versions
    replace: {
      styleguide: {
        src: 'src/styleguide/index.html',
        dest: '.tmp/styleguide/index.html',
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
    },

    // Generate styleguide
    styleguide: {
      options: {
        template: {
          src: '.tmp/styleguide'
        },
        framework: {
          name: 'kss'
        }
      },
      all: {
        files: [{
          'styleguide': 'src/less/dist.less'
        }]
      }
    },

    // Copy files
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: ['css/*', 'js/*'],
          dest: 'dist/'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: 'bower_components/bootstrap/dist/',
          src: ['fonts/*'],
          dest: 'dist/'
        }]
      },
      styleguideSrc: {
        files: [{
          expand: true,
          cwd: 'src/styleguide/public/',
          src: ['**/*'],
          dest: '.tmp/styleguide/public/'
        }]
      },
      styleguide: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'bower_components/jquery/dist/jquery.min.*',
              'bower_components/eonasdan-bootstrap-datetimepicker/build/js/*',
              'bower_components/moment/min/moment.min.js',
              'bower_components/select2/select2.min.js'
            ],
            dest: 'styleguide/public/js/'
          },
          {
            expand: true,
            cwd: 'bower_components/bootstrap/dist/',
            src: ['fonts/*', 'js/*'],
            dest: 'styleguide/public/'
          },
          {
            expand: true,
            cwd: '.tmp/',
            src: ['css/*', 'js/*'],
            dest: 'styleguide/public/'
          },
          {
            expand: true,
            cwd: 'src/images/',
            src: ['*'],
            dest: 'styleguide/public/images/'
          }
        ]
      }
    },

    // Watch task
    watch: {
      less: {
        files: ['src/less/**/*.less'],
        tasks: [
          'build-css',
          'build-styleguide'
        ]
      },
      js: {
        files: ['src/js/*.js'],
        tasks: [
          'build-js',
          'build-styleguide'
        ]
      },
      styleguide: {
        files: [
          'src/less/styleguide.md',
          'src/styleguide/**/*'
        ],
        tasks: [
          'build-styleguide'
        ]
      }
    },

    // Browser Sync
    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'styleguide/public/css/*.css',
            'styleguide/public/js/*.js',
            'styleguide/*.html'
          ]
        },
        options: {
          server: {
            baseDir: './styleguide/'
          },
          watchTask: true
        }
      },
      test: {
        bsFiles: {
          src : [
            'src/js/**/*.js'
          ]
        },
        options: {
          server: {
            baseDir: './'
          }
        }
      }
    },

    // JS tests
    qunit: {
      options: {
        noGlobals: true
      },
      all: ['src/js/tests/index.html']
    }
  });

  // Autoload all Grunt tasks
  require('load-grunt-tasks')(grunt);

  // Measure task execution times
  require('time-grunt')(grunt);

  // Individual build tasks
  grunt.registerTask('build-css', [
    'less',
    'autoprefixer:core',
    'cssmin'
  ]);

  grunt.registerTask('build-js', [
    'jshint:core',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('build-styleguide', [
    'replace:styleguide',
    'copy:styleguideSrc',
    'styleguide',
    'autoprefixer:styleguide',
    'copy:styleguide'
  ]);

  // Build CSS, JS and style guide.
  grunt.registerTask('build', [
    'clean',
    'build-css',
    'build-js',
    'build-styleguide'
  ]);

  // Create distribution package. To be run right before release.
  grunt.registerTask('dist', [
    'test',
    'build',
    'copy:dist',
    'copy:fonts'
  ]);

  // Serve the style guide to browser, watch the source files for changes and update them automatically.
  grunt.registerTask('serve', [
    'build',
    'browserSync:dev',
    'watch'
  ]);

  // Run JS tests in a headless browser.
  grunt.registerTask('test', [
    'jshint',
    'qunit'
  ]);

  // Run JS tests in a real browser.
  // NOTE: add `src/js/tests/` to URL (typically localhost:3000) to view the test page.
  // To access the tests from a remote device that is connected to local network (mobile, tablet, etc.), visit
  // `http://<your local IP address>:3000/src/js/tests/`.
  grunt.registerTask('test-remote', [
    'jshint',
    'browserSync:test'
  ]);

  // Default task
  grunt.registerTask('default', 'test');
};
