module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            dev: {
                src: ['src/**/*.ts'],
                outDir: 'dist',
                options: {
                    module: 'commonjs', //or commonjs
                    target: 'es5', //or es3
                    // basePath: 'path/to/typescript/files',
                    sourceMap: false,
                    declaration: true
                }
            },
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    clearRequireCache: true, // Optionally clear the require cache before running tests (defaults to false)
                    noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
                },
                src: ['dist/test/**/*.js']
            }
        },
        watch: {
            web: {
                files: ['src/**/*.ts'],
                tasks: ['ts','mochaTest'],
                options: {
                    spawn: false,
                },
            }
        },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Default task(s).
    grunt.registerTask('default', ['ts']);
    grunt.registerTask('test', ['mochaTest']);
};