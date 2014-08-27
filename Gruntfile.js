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

		// Watch task
        watch: {
            less: {
                files: ['src/less/**/*.less'],
                tasks: [
                    'less',
                    'styleguide'
                ]
            }
        }
    });

    // Build task
	grunt.registerTask('build', [
		'less',
        'cssmin',
        'styleguide'
    ]);

    // Development
    grunt.registerTask('dev', [
        'build',
        'watch'
    ]);

    // Default task
    grunt.registerTask('default', 'build');
};
