module.exports = function(grunt) {

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
                    'dist/styleguide': 'src/less/main.less'
                }]
            }
        },

        // Copy files
        copy: {
            styleguide: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/dist/',
                        src: ['fonts/*', 'js/*'],
                        dest: 'dist/styleguide/public/'
                    },
                    {
                        expand: true,
                        cwd: 'src/images/',
                        src: ['*'],
                        dest: 'dist/styleguide/public/images/'
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
        }
    });

    // Build task
	grunt.registerTask('build', [
		'less',
        'cssmin',
        'styleguide',
        'copy'
    ]);

    // Development
    grunt.registerTask('dev', [
        'build',
        'watch'
    ]);

    // Default task
    grunt.registerTask('default', 'build');
};
