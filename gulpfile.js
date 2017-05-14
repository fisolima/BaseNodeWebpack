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
var webpack = require('webpack');

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
    webpack(require('./webpack.config'), function (err, stats) {
        if (err)
            throw new gutil.PluginError("webpack", err);

        gutil.log("[webpack]", stats.toString({}));
    });
});

gulp.task("client:prod:compile", function () {
    return tsClientProject.src()
            .pipe(tsClientProject())
            .js
            .pipe(gulp.dest("dist/public/js"));
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

gulp.task("client:prod:concat_js", function() {
    var version = GetArgumentVersionValue();

    return gulp.src(["./dist/public/libs/**/*.js", "./dist/public/js/**/*.js"])
        .pipe(concat("app." + version + ".min.js"))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest("./dist/public/js"));
});

gulp.task("client:prod:inject", function () {
    var version = GetArgumentVersionValue();

    var sources = gulp.src(["./dist/public/js/app." + version + ".min.js", "./dist/public/css/style." + version + ".min.css"], {read: false});

    return gulp.src("./dist/public/index.html")
        .pipe(gulpInject(sources, {relative: true}))
        .pipe(gulp.dest("./dist/public"));
});

gulp.task("client:dev:inject", function () {
    var sources = gulp.src(["./dist/public/libs/**/*.js", "./dist/public/js/**/*.js", "./dist/public/css/**/*.css"], {read: false});

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
    return tsTestProject.src()
            .pipe(tsTestProject())
            .js
            .pipe(gulp.dest("dist/test"));
});

gulp.task("test:run", function () {
    gulp.src(['dist/test/*.test.js'], { read: false })
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
        "client:dev:copy_libs",
        "client:dev:copy_style_libs",
        "client:dev:copy_styles",
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
        "client:dev:copy_libs",
        "client:dev:copy_style_libs",
        "client:dev:copy_styles",
        "client:copy_html",
        "client:prod:compile",
        "client:prod:concat_js",
        "client:prod:concat_css",
        "client:prod:clean",
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