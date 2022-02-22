module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: `${process.env.screepsEmail}`,
                token: `${process.env.screepsToken}`,
                branch: 'experimental',
                // server: 'season',
                ptr: false,
            },
            dist: {
                files: [
                    {
                        src: ['scripts/screeps.com/experimental/*.{js,wasm}'],
                    },
                ],
            },
        },
    });
};
