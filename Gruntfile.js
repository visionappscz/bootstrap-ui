module.exports = function(grunt) {
    'use strict';

    // Measure task execution times
    require('time-grunt')(grunt);

    // Autoload all tasks instead of grunt.loadNpmTasks(...)
    require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

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
                    'dist/css/<%= pkg.name %>.css': 'src/less/dist.less'
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
            grunt: 'Gruntfile.js',
            src: 'src/js/*.js',
            tests: 'src/js/tests/unit/*.js'
        },

        // Concat all JS
        concat: {
            dist: {
                src: [
                    'src/js/*.js'
                ],
                dest: 'dist/js/<%= pkg.name %>.js'
            },
            options: {
                banner: '<%= banner %>'
            }
        },

        // Minify concatenated JS
        uglify: {
            options: {
                preserveComments: 'some'
            },
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>.min.js': 'dist/js/<%= pkg.name %>.js'
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

        // Use banner
        usebanner: {
            options: {
                position: 'top',
                banner: '<%= banner %>'
            },
            files: {
                src: 'dist/css/*.css'
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
                        cwd: 'bower_components/bootstrap/dist/',
                        src: ['fonts/*', 'js/*'],
                        dest: 'styleguide/public/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: [
                            'bower_components/eonasdan-bootstrap-datetimepicker/build/js/*',
                            'bower_components/moment/min/moment.min.js',
                            'bower_components/select2/select2.min.js'
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
                    'build-styleguide'
                ]
            },
            js: {
                files: ['src/js/*.js'],
                tasks: [
                    'jshint:src',
                    'concat',
                    'uglify',
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

    // Build task
	grunt.registerTask('build', [
        'clean',
		'less',
        'cssmin',
        'jshint',
        'concat',
        'uglify',
        'usebanner',
        'build-styleguide',
        'copy:dist'
    ]);

    // Serve and watch
    grunt.registerTask('serve', [
        'build',
        'browserSync:dev',
        'watch'
    ]);

    // Build style guide
    grunt.registerTask('build-styleguide', [
        'replace:styleguide',
        'copy:styleguideSrc',
        'styleguide',
        'copy:styleguide'
    ]);

    // Run JS tests in browser
    // NOTE: add `src/js/tests/` to URL (typically localhost:3000) to view the test page.
    grunt.registerTask('test', [
        'jshint',
        'browserSync:test'
    ]);

    // Default task
    grunt.registerTask('default', 'build');
};
