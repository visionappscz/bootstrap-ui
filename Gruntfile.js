module.exports = function(grunt) {

    // Measure task execution times
    require('time-grunt')(grunt);

    // Autoload all tasks instead of grunt.loadNpmTasks(...)
    require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        // Load meta info from package.json
        pkg: grunt.file.readJSON('package.json'),

        // Compile LESS
        less: {
            dist: {
                files: {
                    'dist/css/<%= pkg.name %>.css': 'src/less/main.less'
                }
            }
        },

        // Minify CSS
        cssmin: {
            dist: {
                files: {
                    'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css'
                }
            }
        },

        // Lint custom JS
        jshint: {
            files: [
                'src/js/**/*.js'
            ]
        },

        // Concat all JS
        concat: {
            dist: {
                src: [
                    'src/js/*.js'
                ],
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },

        // Minify concatenated JS
        uglify: {
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>.min.js': 'dist/js/<%= pkg.name %>.js'
                }
            }
        },

        // Generate styleguide
        styleguide: {
            options: {
                template: {
                    src: 'src/styleguide'
                },
                framework: {
                    name: 'kss'
                }
            },
            all: {
                files: [{
                    'styleguide': 'src/less/main.less'
                }]
            }
        },

        // Copy files
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'bower_components/bootstrap/dist/',
                    src: ['fonts/*'],
                    dest: 'dist/'
                }]
            },
            styleguide: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/dist/',
                        src: ['fonts/*', 'js/*'],
                        dest: 'styleguide/public/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: [
                            'bower_components/eonasdan-bootstrap-datetimepicker/build/js/*',
                            'bower_components/moment/min/moment.min.js'
                        ],
                        dest: 'styleguide/public/js/'
                    },
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['css/*', 'js/*'],
                        dest: 'styleguide/public/'
                    },
                    {
                        expand: true,
                        cwd: 'src/images/',
                        src: ['*'],
                        dest: 'styleguide/public/images/'
                    },
                    {
                        expand: true,
                        cwd: 'src/js/',
                        src: ['*'],
                        dest: 'styleguide/public/js/'
                    }
                ]
            }
        },

		// Watch task
        watch: {
            less: {
                files: ['src/less/**/*.less'],
                tasks: [
                    'less',
                    'cssmin',
                    'styleguide',
                    'copy'
                ]
            },
            styleguide: {
                files: [
                    'src/less/styleguide.md',
                    'src/styleguide/**/*',
                    'src/js/**/*'
                ],
                tasks: [
                    'jshint',
                    'styleguide',
                    'copy'
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

    // Build task
	grunt.registerTask('build', [
		'less',
        'cssmin',
        'jshint',
        'concat',
        'uglify',
        'styleguide',
        'copy'
    ]);

    // Serve and watch
    grunt.registerTask('serve', [
        'build',
        'browserSync:dev',
        'watch'
    ]);

    // Alias
    grunt.registerTask('dev', 'serve');

    // Run JS tests in browser
    // NOTE: add `src/js/tests/` to URL (typically localhost:3000) to view the test page.
    grunt.registerTask('test', [
        'jshint',
        'browserSync:test'
    ]);

    // Default task
    grunt.registerTask('default', 'build');
};
