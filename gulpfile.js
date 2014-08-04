"use strict";

var gulp = require("gulp");
var r = require("gulp-load-plugins")();

var src = {
	js: "src/*.coffee",
	lib: [
		"bower_components/angular/angular.js",		
		"bower_components/ng-paste-from/dist/*latest.min*"
	],
	livereload: ["dist/*", "lib/*"]
};

var dest = {
	dist: "dist",
	lib: "lib"
};

gulp.task("default", function() {
	return gulp.start("js", "lib");
});

gulp.task("watch", function() {
	gulp.watch(src.js, ["js"]);
	gulp.watch(src.lib, ["lib"]);
	return gulp.start("default");
});

gulp.task("serve", function() {
	r.connect.server({
		port: 3000,
		root: ".",
		livereload: {
			ignore: [
				"^bower_components",
				"^node_modules"
			]
		}
	});
	return gulp.start("livereload", "watch");
});

gulp.task("livereload", function() {
	return gulp.src(src.livereload)
			.pipe(r.watch())
			.pipe(r.connect.reload());
});

gulp.task("js", function() {
	return gulp.src(src.js)
			.pipe(r.sourcemaps.init())
			.pipe(r.coffee())
			// Mangle will shorten variable names which breaks the AngularJS dependency injection.
			// TODO: Use a build tool to preserve the important variables instead of disabling mangle.
			.pipe(r.uglify({mangle: false}))
			.pipe(r.rename({suffix: ".min"}))
			.pipe(r.sourcemaps.write("./"))
			.pipe(gulp.dest(dest.dist));
});

gulp.task("lib", function() {
	return gulp.src(src.lib)
			.pipe(gulp.dest(dest.lib));
});
