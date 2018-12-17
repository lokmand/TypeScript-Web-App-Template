var gulp = require("gulp");

var del = require("del");
var watch = require("gulp-watch");
var sourcemaps = require("gulp-sourcemaps");

/* Packages required for transpiling TypeScript */
var ts = require("gulp-typescript");
var ts_project = ts.createProject("tsconfig.json");
var tslint = require("gulp-tslint");
var uglify = require("gulp-uglify");

/* Packages required for transpiling styles */
var sass = require("gulp-sass");
sass.compiler = require("node-sass");
var concat = require('gulp-concat');
var clean_css = require("gulp-clean-css");

/* Convience Variables */
let dirs = {
	src: "src",					/* The sources code we build from */
	dist: "dist",				/* Where the final files will live */
	maps: "maps", 				/* Source mappings */

    icons_src: "src/icons/**/*.png",    /* Where the icons and MS tiles live */
    fav_icon: "/icons/favicon.ico",     /* Where the favicon.ico lives */
    icons_dist: "dist/icons",

    img_src: "src/img/**/*.+(png|jpg|gif)",
    img_dist: "dist/img",

	ts_src: "src/**/*.ts",
	js_dist: ["dist/**/*.js", "dist/maps/*.js.map"],

	html_src: "src/**/*.html",
	html_dist: "dist/**/*.html",

	scss_src: "src/**/*.scss",
	css_dist: ["dist/**/*.css", "dist/maps/*.css.map"]
}

/************
 *  UTLITY  *
*************/

/* Removes everything from dist/ */
gulp.task("clean", (done) => {
	return del([
	    	dirs.dist
	  	]);
});

/* Copies the site.manifest file to dist/ */
gulp.task("copy:manifest", () => {
    return gulp.src([
    		dirs.src + "/icons/site.webmanifest"
    	])
        .pipe(gulp.dest(dirs.dist));
});

/* Copies the browserconfig.xml file to dist/ */
gulp.task("copy:browserconfig", () => {
    return gulp.src([
            dirs.src + "/icons/browserconfig.xml"
        ])
        .pipe(gulp.dest(dirs.dist));
});

/* Copies the robots.txt to dist/ */
gulp.task("copy:robots", () => {
    return gulp.src([
    		dirs.src + "/robots.txt"
    	])
        .pipe(gulp.dest(dirs.dist));
});

/* Copies the humans.txt to dist/ */
gulp.task("copy:humans", () => {
    return gulp.src([
            dirs.src + "/humans.txt"
        ])
        .pipe(gulp.dest(dirs.dist));
});

/* Copies the favicon.ico to dist/ */
gulp.task("copy:ico", () => {
    return gulp.src(dirs.src + dirs.fav_icon)
        .pipe(gulp.dest(dirs.dist));
});

/* Copies the icons and tiles to dist/icons/ */
gulp.task("copy:icons", () => {
    return gulp.src(dirs.icons_src)
        .pipe(gulp.dest(dirs.icons_dist));
});

/* Copy all the images to dist/img/ */
gulp.task("copy:images", () => {
    return gulp.src(dirs.img_src)
        .pipe(gulp.dest(dirs.img_dist));
});

/* Copy all the miscellaneous files, manifests and icons */
gulp.task("copy:misc", gulp.parallel("copy:manifest", "copy:browserconfig", "copy:robots", "copy:humans", "copy:ico", "copy:icons", "copy:images"));

/**********
 *  HTML  *
***********/

/* Removes all the html files from dist/ */
gulp.task("clean:html", () => {
	return del([
    	dirs.html_dist
  	])
});

/* Copies the HTML source to dist/ */
gulp.task("copy:html",() => {
    return gulp.src([
    		dirs.html_src
    	])
        .pipe(gulp.dest(dirs.dist));
});

/* Copies the HTML over to dist/ */
gulp.task("html", gulp.series("clean:html", "copy:html"));

/****************
 *  TypeScript  *
*****************/

/* Removes all the ts files from dist/ */
gulp.task("clean:js", () => {
	return del(dirs.js_dist);
});

/* Checks your code for neatness. See tslint.json for options. */ 
gulp.task("lint:ts", (done) =>
    gulp.src([
        	dirs.ts_src
    	])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
);

/* Transpiles the TypeScript to ES6, minifies it, and moves it to dist/ */
gulp.task("transpile:ts", () => {
    /* Transpile the code */
    var js_code = gulp.src([
        dirs.ts_src
   	])
   	.pipe(sourcemaps.init())
  	.pipe(ts_project(ts.reporter.fullReporter()))

  	/* Minify the code */
    return js_code.js
        .pipe(uglify())
        .pipe(sourcemaps.write(dirs.maps))
        .pipe(gulp.dest(dirs.dist));
});

/* Lints, builds, minifies and copies the TypeScript files to dist/ */
gulp.task("typescript", gulp.series("clean:js", "lint:ts", "transpile:ts"));

/************
 *  Styles  *
*************/

/* Removes all the css files from dist/ */
gulp.task("clean:css", () => {
	return del(dirs.css_dist);
});

/* Convert all the SCSS files to CSS, concatenate them into styles.css and 
 * minify that files.
*/
gulp.task("transpile:scss", () => {
  return gulp.src(dirs.scss_src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("styles.css"))
    .pipe(clean_css())
    .pipe(sourcemaps.write(dirs.maps))
    .pipe(gulp.dest(dirs.dist));
});

gulp.task("styles", gulp.series("clean:css", "transpile:scss"));


/* Lints the program, builds, minifies and copies it to /dist */
gulp.task("build", gulp.parallel("html", "typescript", "styles", "copy:misc"));
gulp.task("default", gulp.parallel("build"));

/* Watches for changes and then rebuilds */
gulp.task("watch", () => {
	gulp.watch(dirs.html_src, gulp.series("html"));
	gulp.watch(dirs.scss_src, gulp.series("styles"));
	gulp.watch(dirs.ts_src, gulp.series("typescript"));


    gulp.watch(dirs.src + "/site.webmanifest", gulp.series("copy:manifest"));
    gulp.watch(dirs.src + "/browserconfig.xml", gulp.series("copy:browserconfig"));
    gulp.watch(dirs.src + "/robots.txt", gulp.series("copy:robots"));
    gulp.watch(dirs.src + "/humans.txt", gulp.series("copy:humans"));
    gulp.watch(dirs.src + dirs.fav_icon, gulp.series("copy:ico"));
    gulp.watch(dirs.icons_src, gulp.series("copy:icons"));
    gulp.watch(dirs.img_src, gulp.series("copy:images"));
});