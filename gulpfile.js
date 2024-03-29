var gulp = require('gulp');
var browserSync = require('browser-sync');
var packageJson = require('./package.json');
var usemin = require('gulp-usemin');
var wrap = require('gulp-wrap');
var minifyCss = require('gulp-minify-css');
var minifyJs = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var less = require('gulp-less');
var path = require('path');

var runSeq = require('run-sequence');


var paths = {
    styles: './styles/**/*.*',
    images: './img/**/*.*',
    templates: './modules/**/*.html',
    index: 'index.html'
};


gulp.task('less', function() {
    return gulp.src('./styles/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./styles/css'));
});

gulp.task('clean', function() {
    return gulp.src('dist').pipe(clean({
        force: true
    }));
});

gulp.task('copyfonts', function(callback) {
    return gulp.src([
            './bower_components/font-awesome/fonts/fontawesome-webfont.*',
            './vendor/bootstrap/fonts/*.*'
        ])
        .pipe(gulp.dest('dist/fonts'));
});


gulp.task('copyimages', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('dist/img'));
});


gulp.task('minify', function() {
    return gulp.src(paths.index)
        .pipe(usemin({
            js: [minifyJs().on('error', function(err) {
                console.log('error: ', err)
            }), 'concat'],
            css: [minifyCss({
                keepSpecialComments: 0
            }).on('error', function(err) {
                console.log('error: ', err)
            }), 'concat'],
            js1: [minifyJs(), 'concat']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copytemplates', function() {
    gulp.src(paths.templates)
        .pipe(gulp.dest('dist/modules'));
});

gulp.task('serve', function() {
    browserSync.init({
        notify: false,
        port: 9005,
        server: "./",
        ui: {
            port: 24680
        }
    });

    gulp.watch(['index.html', 'scripts/**/*.*', 'styles/**/*.*', 'modules/**/*.*'])
        .on('change', browserSync.reload);
});

gulp.task('servedist', function() {
    browserSync.init({
        notify: false,
        port: 9013,
        server: "./dist",
        routes: {
            "bower_components": "../bower_components"
        },
        ui: {
            port: 24681
        }
    });
});


gulp.task('build', function() {
    return runSeq('clean', 'minify', 'copytemplates', 'copyfonts', 'copyimages');
});

gulp.task('dist', function() {
    return runSeq('minify', 'copytemplates', 'copyfonts', 'copyimages');
});
