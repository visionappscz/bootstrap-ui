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

        // Compile Coffee script
        coffee: {
            compile: {
                files: {
                    "dist/js/sortable-tables.js": "src/coffee/sortable-tables.coffee"
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
                        flatten: true,
                        src: ['bower_components/select2/*.png'],
                        dest: 'styleguide/public/css/'
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
            coffee: {
                files: ['src/coffee/*.coffee'],
                tasks: [
                    'coffee',
                    'styleguide',
                    'copy'
                ]
            },
            styleguide: {
                files: [
                    'src/less/styleguide.md',
                    'src/styleguide/**/*'
                ],
                tasks: [
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
            }
        }
    });

    // Build task
	grunt.registerTask('build', [
		'less',
        'cssmin',
        'coffee',
        'styleguide',
        'copy'
    ]);

    // Development
    grunt.registerTask('dev', [
        'build',
        'watch'
    ]);

    // Serve and watch
    grunt.registerTask('serve', [
        'build',
        'browserSync',
        'watch'
    ]);

    // Default task
    grunt.registerTask('default', 'build');
};
