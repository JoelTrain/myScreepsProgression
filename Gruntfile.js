module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-file-append');
    
    var currentdate = new Date();

    // Allow grunt options to override default configuration
    const branch = grunt.option('branch') || 'experimental' || config.branch;
    const email = grunt.option('email') || `${process.env.screepsEmail}` || config.email;
    const token = grunt.option('token') || `${process.env.screepsToken}` || config.token;
    const ptr = grunt.option('ptr') ? true : false; //config.ptr;
    // var private_directory = grunt.option('private_directory') || config.private_directory;

    // Output the current date and branch.
    grunt.log.subhead('Task Start: ' + currentdate.toLocaleString());
    grunt.log.writeln('Branch: ' + branch);

    grunt.initConfig({
        screeps: {
            options: {
                email: email,
                token: token,
                branch: branch,
                // server: 'season',
                ptr: ptr,
            },
            dist: {
                files: [
                    {
                        src: ['scripts/screeps.com/experimental/*.{js,wasm}'],
                    },
                ],
            },
        },
        file_append: {
            versioning: {
              files: [
                {
                  append: '\nglobal.SCRIPT_VERSION = ' + currentdate.getTime() + '\n;',
                  input: 'scripts/screeps.com/experimental/version.js',
                }
              ]
            }
        },
    });
    grunt.registerTask('default',  ['file_append:versioning', 'screeps']);
};
