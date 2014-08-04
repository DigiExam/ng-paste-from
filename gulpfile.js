"use strict";

var gulp = require("gulp");
var r = require("gulp-load-plugins")();

var src = {
	js: "src/*.coffee"
};

var dest = "dist";

gulp.task("default", function() {
	return gulp.start("js", "js-min");
});

gulp.task("watch", function() {
	gulp.watch(src.js, ["js", "js-min"]);
	return gulp.start("default");
});

gulp.task("js", function() {
	return gulp.src(src.js)
			.pipe(r.sourcemaps.init())
			.pipe(r.coffee())
			.pipe(r.rename({suffix: "-latest"}))
			.pipe(r.sourcemaps.write("./"))
			.pipe(gulp.dest(dest));
});

gulp.task("js-min", function() {
	return gulp.src(src.js)
			.pipe(r.sourcemaps.init())
			.pipe(r.coffee())
			// Mangle will shorten variable names which breaks the AngularJS dependency injection.
			// TODO: Use a build tool to preserve the important variables instead of disabling mangle.
			.pipe(r.uglify({mangle: false}))
			.pipe(r.rename({suffix: "-latest.min"}))
			.pipe(r.sourcemaps.write("./"))
			.pipe(gulp.dest(dest));
});