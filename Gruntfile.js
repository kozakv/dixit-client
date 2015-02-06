/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    buildDir: "build", //../../../glassfish4/glassfish/domains/domain1/applications/dixit-0.0.1",
    distDir: "dist",

    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ["src/js/<%= pkg.name %>.js",
              "src/js/*.js"],
        dest: '<%= buildDir %>/js/<%= pkg.name %>.js'
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: "JST",
          processName: function(filepath) {
            var names = filepath.substr(0, filepath.length - 4).split("/");
            return names[names.length - 1];
          },
          partialRegex: /.*/,
          partialsPathRegex: /\/partials\//
        },
        files: {
          "<%= buildDir %>/js/templates.js": "src/templates/**/*.hbs"
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      libs: {
        src: '<%= buildDir %>/js/libs.js',
        dest: '<%= distDir %>/js/libs.min.js'
      },
      application: {
        src: '<%= concat.dist.dest %>',
        dest: '<%= distDir %>/js/<%= pkg.name %>.min.js'
      },
      templates: {
        src: "<%= buildDir %>/js/templates.js",
        dest: "<%= distDir %>/js/templates.min.js"
      }
    },
    less: {
      development: {
        options: ["assets/css"],
        files: {
          "<%= buildDir %>/css/main.css": "src/less/main.less"
        }
      },
      production: {
        options: ["assets/css"],
        cleancss: true,
        files: {
          "<%= distDir %>/css/main.css": "src/less/main.less"
        }
      }
    },
    copy: {
      development: {
        files: [
          { expand: true, cwd: "src/images/", src: "**/*", dest: "<%= buildDir %>/images/" },
          { expand: true, cwd: "src/sounds/", src: "**/*", dest: "<%= buildDir %>/sounds/" }
        ]
      },
      production: {
        files: [
          { expand: true, cwd: "src/images/", src: "**/*", dest: "<%= distDir %>/images/" },
          { expand: true, cwd: "src/sounds/", src: "**/*", dest: "<%= distDir %>/sounds/" }
        ]
      }
    },
    bower: {
      install: {}
    },
    bower_concat: {
      development: {
        cssDest: "<%= buildDir %>/css/bower.css",
        dest: "<%= buildDir %>/js/libs.js"
      }
    },
    connect: {
      development: {
        options: {
          port: 9009,
          base: "<%= buildDir %>"
        }
      },
      production: {
        options: {
          port: 9000,
          base: "<%= distDir %>"
        }
      }
    },
    watch: {
      js: {
        files: '<%= concat.dist.src %>',
        tasks: ['concat']
      },
      css: {
        files: ["src/less/**/*.less"],
        tasks: ["less:development"]
      },
      templates: {
        files: ["src/templates/**/*.hbs"],
        tasks: ["handlebars"]
      },
      static: {
        files: ["src/images/**/*", "src/sounds/**/*"],
        tasks: ["copy:development"]
      },
      bower: {
        files: ["bower.json"],
        tasks: ["bower:install", "bower_concat"]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks("grunt-bower-concat");
  grunt.loadNpmTasks("grunt-bower-task");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-handlebars");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("build-all", ["bower:install", "bower_concat", "concat", "less:development", "copy:development",
                                   "handlebars"]);
  grunt.registerTask("default", ["build-all", "connect:development", "watch"]);
  grunt.registerTask("build-and-watch", ["build-all", "watch"]);
  grunt.registerTask("deploy", ["build-all", "uglify", "less:production", "copy:production"]);
  grunt.registerTask("deploy-site", ["deploy", "connect:production:keepalive"]);

};
