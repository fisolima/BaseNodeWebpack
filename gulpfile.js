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
var path = require('path');
var gulpWebpack = require('webpack-stream');
const webpack = require('webpack')

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
    // return webpack(require('./webpack.config'), function (err, stats) {
    //     if (err)
    //         throw new gutil.PluginError("webpack", err);

    //     gutil.log("[webpack]", stats.toString({}));
    // });
    return gulp.src("src/client/startup.es6")
        .pipe(gulpWebpack(require('./webpack.config'), webpack))
        .pipe(gulp.dest('./'));
});

gulp.task("client:prod:compile", function () {
    // return tsClientProject.src()
    //         .pipe(tsClientProject())
    //         .js
    //         .pipe(gulp.dest("dist/public/js"));
    throw new gutil.Error("Not implemented");

    //var version = GetArgumentVersionValue();
});

gulp.task("client:prod:clean", function () {
    var version = GetArgumentVersionValue();

    return del(
        ["dist/public/css/**/*.css",
        "dist/public/css/libs",
        "!dist/public/css/style." + version + ".min.css",
        "dist/public/js/**/*.js",
        "dist/public/libs",
        "!dist/public/js/app." + version + ".min.js"]);
});

gulp.task("client:prod:inject", function () {
    var version = GetArgumentVersionValue();

    var sources = gulp.src(["./dist/public/js/app." + version + ".min.js", "./dist/public/css/style." + version + ".min.css"], {read: false});

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

gulp.task("test:clean", function () {
    return del("dist/test/**/*");
});

gulp.task("test:compile", function () {
    // return tsTestProject.src()
    //         .pipe(tsTestProject())
    //         .js
    //         .pipe(gulp.dest("dist/test"));
    throw new gutil.Error("Not implemented")
});

gulp.task("test:run", function () {
    // gulp.src(['dist/test/*.test.js'], { read: false })
    // .pipe(mocha({
    //   reporter: 'spec'
    // }));
    throw new gutil.Error("Not implemented")
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
        "test:compile",
        "test:run",
        function () {
            done();
        }
    );
});