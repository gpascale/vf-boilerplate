var path = require('path');
var fs = require('fs');
var _ = require('underscore');

module.exports = function(grunt) {

    /*************************************************************************/
    // Clean - Completely clean the build by removing all build folders.
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.config('clean', ['build']);

    /*************************************************************************/
    // Copy static resources and apex stuff
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.config('copy', {
        staticresources: {
            expand: true,
            cwd: 'resources',
            src: '**',
            dest: 'build/intermediates/staticresources'
        },
        other: {
            expand: true,
            cwd: 'src/apex',
            src: '{pages,layouts,objects,classes,triggers,components}/*.{page,layout,object,cls,trigger,component}',
            dest: 'build/package'
        }
    });

    /*************************************************************************/
    // Less - Compile less files and move to the intermediates folder
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.config('less', {
        all: {
            files: {
                'build/intermediates/staticresources/css/##PROJECT_NAME##.css': 'src/less/client/*.less',
            }   
        },
        options: {
            cleancss: true,
            paths: ['src/less']
        }
    });

    /*************************************************************************/
    // Compile underscore templates
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.config('jst', {
        compile: {
            options: {
                namespace: '##PROJECT_NAME##.Templates',
                processName: function(filename) {
                    return path.basename(filename, '.tmpl');
                },
                prettify: true,
                templateSettings: { variable: 'data' }
            },
            files: {
                "build/intermediates/templates.js": ["src/templates/*.tmpl"]
            }
        }
    });

    /*************************************************************************/
    // Concatenate JS and CSS
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.config('concat', {
        js: {
            // Note, collections come last because they depend on models
            src: [ 'build/intermediates/templates.js', 'src/js/!(*Collection.js)', 'src/js/*.js' ],
            dest: 'build/intermediates/staticresources/js/##PROJECT_NAME##.js',
            options: {
                banner: ';(function() {\n',
                separator: '\n})();\n;(function() { "use strict";\n',
                footer: '\n})();\n'
            }
        },
        extJs: {
            src: [ 
                'resources/js/*.js' 
            ],
            dest: 'build/intermediates/staticresources/js/##PROJECT_NAME##.external.js'
        }
    });

    /*************************************************************************/
    // JS Lint
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.config('jshint', {
        options: {
            force: true
        },
        beforeconcat: 'src/js/*.js'
    });

    /*************************************************************************/
    // Static - Create a static resource bundle
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.config('compress', {
        'static': {
            options: {
                archive: 'build/package/staticresources/##PROJECT_NAME##.resource',
                mode: 'zip'
            },
            files: [{
                expand: true,
                cwd: 'build/intermediates/staticresources/',
                src: ['**']
            }]
        }
    });

    /*************************************************************************/
    // Meta - Create "-meta" files for components, pages, resources, etc...
    /*************************************************************************/
    grunt.registerTask('meta', function() {
        var templatesByType = {
            classes: 'apexBuildTemplates/class-meta.tmpl',
            components: 'apexBuildTemplates/component-meta.tmpl',
            pages: 'apexBuildTemplates/page-meta.tmpl',
            staticresources: 'apexBuildTemplates/resource-meta.tmpl',
            triggers: 'apexBuildTemplates/trigger-meta.tmpl'
        };
        for (var type in templatesByType) {
            var dir = 'build/package/' + type;
            try {
                var files = fs.readdirSync(dir);
                console.log(type + " " + dir);
                files.forEach(function(filename) {
                    var templateFile = templatesByType[type];
                    if (templateFile) {
                        var template = grunt.file.read(templateFile);
                        var contents = _.template(template, { label: filename.split('.')[0] });
                        var outPath = dir + '/' + filename + '-meta.xml';
                        grunt.file.write(outPath, contents);
                    }
                });
            } catch(e) { }
        };
    });

    /*************************************************************************/
    // Local Staging - Stage js and css files locally to reduce deployments
    /*************************************************************************/
    grunt.registerTask('stageLocal', function() {
        grunt.config.set('copy.stageLocal', {
            // Note: Copying whole build folder, since files may depend on
            // other files e.g. clipforce.css may reference images/fonts etc
            // don't want to have to manually stick them in here each time
            src: [ 'build/**' ],
            dest: 'stageLocal/files/',
            flatten: false,
            expand: true
        });
        grunt.task.run('copy:stageLocal');
    });

    /*************************************************************************/
    // Ant Deploy
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-ant-sfdc');
    grunt.config('antdeploy', {
        options: {
            root: 'build/package/',
            version: '29.0'
        }
    });
    grunt.registerTask('doDeploy', function() {
        grunt.config.set('antdeploy.foo.pkg', {
            apexclass: ['*'],
            apexcomponent: ['*'],
            apextrigger: ['*'],
            staticresource: ['*'],
            apexpage: ['*'],
            layout: ['*'],
            customobject: ['*']
        });
        var profileName = grunt.option('profile');
        if (!profileName)
            grunt.fail.fatal('A deployment profile is required');
        else if (!profiles[profileName])
            grunt.fail.fatal('Deployment profile \'' + profileName + '\' not recognized');
        var data = profiles[profileName];
        data.root = 'build/package/';
        grunt.config.set('antdeploy.foo.options', data);
        grunt.task.run('antdeploy:foo');
    });
    var profiles = {
        greg: {
            user: 'gpascale@clip.sbx',
            pass: 'qaz12345',
            serverurl: 'https://test.salesforce.com'
        },
    };

    /*************************************************************************/
    // Watch
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.config('watch', {
        local: {
            files: ['src/js/**/*', 'src/less/**/*', 'src/templates/**/*',
                    'Gruntfile.js'],
            tasks: ['clean', 'build']
        },
        apex: {
            files: ['src/apex/**/*', 'resources/**/*'],
            tasks: ['clean', 'build', 'deploy'],
            options: {
                atBegin: true
            }
        }
    });

    /*************************************************************************/
    /*************************************************************************/
    /*************************************************************************/

    grunt.registerTask('build', ['clean', 'copy', 'less', 'jst', 'concat', 'compress', 'stageLocal']);
    grunt.registerTask('buildprod', ['clean', 'copy', 'less', 'jst', 'jshint:beforeconcat', 'concat', 'compress', 'stageLocal']);
    grunt.registerTask('deploy', ['meta', 'doDeploy']);
    grunt.registerTask('default', ['build', 'deploy']);
};
