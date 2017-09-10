var gulp = require("gulp");
var gutil = require('gulp-util');
var runSequence = require("run-sequence");
var del = require("del");
var gulpInject = require('gulp-inject');
var sourcemaps = require("gulp-sourcemaps");
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-clean-css');
var path = require('path');
var gulpWebpack = require('webpack-stream');
var webpack = require('webpack');
var webpackProdConfig = require('./webpack.prod.config');
var gulpReplace = require('gulp-replace');

/**
 * Internal tasks
 */

function GetArgumentVersionValue() {
    var version,
        i = process.argv.indexOf("--build_version");

    if (i>-1) {
        version = process.argv[i+1];
    }

    if (!version)
        throw new Error("--build_version option is not declared");

    return version;
}

gulp.task("server:clean", function () {
    return del("dist/server/**/*");
});

gulp.task("client:clean", function () {
    return del("dist/public/**/*");
});

gulp.task("client:copy_html", function () {
    return gulp.src(["src/client/**/*.html"])
        .pipe(gulp.dest("dist/public"));
});

gulp.task("client:dev:compile", function () {
    return gulp.src("src/client/startup.es6")
        .pipe(gulpWebpack(require('./webpack.config'), webpack))
        .pipe(gulp.dest('./'));
});

gulp.task("client:prod:compile", function () {
    return gulp.src("src/client/startup.es6")
        .pipe(gulpWebpack(webpackProdConfig(GetArgumentVersionValue()), webpack))
        .pipe(gulp.dest('./')); 
});

gulp.task("client:prod:inject", function () {
    var sources = gulp.src(["./dist/public/**/*.min.js", "./dist/public/**/*.min.css"], {read: false});

    return gulp.src("./dist/public/index.html")
        .pipe(gulpInject(sources, {relative: true}))
        .pipe(gulp.dest("./dist/public"));
});

gulp.task("client:dev:inject", function () {
    var sources = gulp.src(["./dist/public/**/*.js", "./dist/public/**/*.css"], {read: false});

    return gulp.src("./dist/public/index.html")
        .pipe(gulpInject(sources, {relative: true}))
        .pipe(gulp.dest("./dist/public"));
});

gulp.task("server:dev:compile", function() {
    return gulp.src("./src/server/**/*.js")
                .pipe(gulp.dest("./dist/server"));
});

gulp.task("server:prod:compile", function() {
    return gulp.src("./src/server/**/*.js")
                .pipe(stripDebug())
                .pipe(gulp.dest("./dist/server"));
});

gulp.task("client:adjustcsspath", function() {
    return gulp.src("./dist/public/css/*.css")
        .pipe(gulpReplace('url(dist/public/font/', 'url(../font/'))
        .pipe(gulp.dest("./dist/public/css"));
});

gulp.task("client:uglifycss", function() {
    return gulp.src("./dist/public/css/*.css")
        .pipe(uglifycss())
        .pipe(gulp.dest("./dist/public/css"));
});

gulp.task("test:clean", function () {
    return del("dist/test/**/*");
});

gulp.task("test:compile", function () {
    return gulp.src("./src/test/**/*")
                .pipe(gulp.dest("./dist/test"));
});

gulp.task("test:run", function () {
    return gulp.src(['dist/test/*.test.js'], { read: false })
                .pipe(mocha({
                    reporter: 'spec'
                }));
});

/**
 * Available tasks
 */

gulp.task("server:dev:build", function (done) {
    runSequence(
        "server:clean",
        "server:dev:compile",
        function() {
            done();
        }
    );
});

gulp.task("client:dev:build", function (done) {
    runSequence(
        "client:clean",
        "client:copy_html",
        "client:dev:compile",
        "client:adjustcsspath",
        "client:dev:inject",        
        function () {
            done();
        }
    );
});

gulp.task("client:prod:build", function (done) {
    runSequence(
        "client:clean",
        "client:copy_html",
        "client:prod:compile",
        "client:adjustcsspath",
        "client:uglifycss",
        "client:prod:inject",
        function () {
            done();
        }
    );
});

gulp.task("server:prod:build", function (done) {
    runSequence(
        "server:clean",
        "server:prod:compile",
        function() {
            done();
        }
    );
});

gulp.task("dev:build", function (done) {
    runSequence(
        "server:dev:build",
        "client:dev:build",
        function() {
            done();
        }
    );
});

gulp.task("prod:build", function (done) {
    runSequence(
        "server:prod:build",
        "client:prod:build",
        function() {
            done();
        }
    );
});

gulp.task("test", function (done) {
    runSequence(
        "test:clean",
        "server:dev:build",
        "client:dev:build",
        "test:compile",
        "test:run",
        function () {
            done();
        }
    );
});