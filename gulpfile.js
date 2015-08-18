'use strict';

var gulp        = require('gulp'),
    less        = require('gulp-less'),
    sourcemaps  = require('gulp-sourcemaps'),
    gutil       = require('gulp-util'),
    minifyCSS   = require('gulp-minify-css'),
    uglify      = require('gulp-uglify'),
    watchify    = require('watchify'),
    stringify   = require('stringify'),
    streamify   = require('gulp-streamify'),
    browserify  = require('browserify'),
    browserSync = require('browser-sync').create(),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    assign      = require('lodash.assign');

    var customOpts = {
      entries: ['./js/main.js'],
        debug: true,
        standalone : 'expressions'
    };
    var opts = assign({}, watchify.args, customOpts);
    var b = watchify(browserify(opts));

    // add transformations here
    // todo: stripify the prod build to remove console.log
    //  i.e. b.transform(coffeeify);

    gulp.task('js', bundle); // so you can run `gulp js` to build the file
    b.on('update', bundle); // on any dep update, runs the bundler
    b.on('log', gutil.log); // output build logs to terminal


    /*
    Compiles less but excludes partials starting with underscore, e.g. _loader.less
     */
    gulp.task('less', function() {
      var ret = gulp.src(['./less/**/*.less', '!./less/**/_*'])
          .pipe(less())
          .pipe(minifyCSS())
          .pipe(gulp.dest('./dist'))
          .pipe(browserSync.stream())
          .on('error', gutil.log.bind(gutil, 'Less Error'));

          console.log('less', ret);
      return ret
    });

    function bundle() {
      return b
        .transform(stringify(['.html']))
        .bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        // optional, remove if you don't need to buffer file contents
        // optional, remove if you dont want sourcemaps
        // .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
           // Add transformation tasks to the pipeline here.
        .pipe(streamify(uglify()))
        // .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./dist'));
    }

/*
This is the one that makes a live server with autorefresh for all your debuggy needs.
 */
gulp.task('serve', ['less', 'js'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./less/**/*.less", ['less']);
    gulp.watch("./dist/*.js").on('change', browserSync.reload);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

//These are the tasks most likely to be run by a user

/*
starts server for dev use
 */
gulp.task('dev', [
  'serve', //includes css
  'js'
], function() {
  gutil.log(gutil.colors.yellow('| =================================================='));
  gutil.log(gutil.colors.yellow('| Congrats, it looks like everything is working!'));
  gutil.log(gutil.colors.yellow('| Browsersync is running on the ports below and will'));
  gutil.log(gutil.colors.yellow('| Live-reload your js and CSS as you work.'));
  gutil.log(gutil.colors.yellow('| ____________________________________________'));
  gutil.log(gutil.colors.yellow('|'));
  gutil.log(gutil.colors.yellow('| To run tests while working, open a new terminal and run:'));
  gutil.log(gutil.colors.yellow('| mocha --watch'));
  gutil.log(gutil.colors.yellow('| =================================================='));
});


/*
Build for prod use
 */
gulp.task('default', [
  'less',
  'js'
], function() {
  gutil.log(gutil.colors.green('| =====================|'));
  gutil.log(gutil.colors.green('|   Project built! :)  |'));
  gutil.log(gutil.colors.green('| =====================|'));
});

//todo: add error handling to the messages above?
