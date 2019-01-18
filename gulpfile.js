const gulp = require("gulp");

const del = require("del");
const watch = require("gulp-watch");
const sourcemaps = require("gulp-sourcemaps");

/* Packages required for transpiling TypeScript */
const ts = require("gulp-typescript");
const ts_project = ts.createProject("tsconfig.json");
const tslint = require("gulp-tslint");
const uglify = require("gulp-uglify");

/* Packages required for transpiling styles */
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const concat = require('gulp-concat');
const clean_css = require("gulp-clean-css");
const through2 = require("through2");

/* Packages for modifying the HTML */
const inject = require('gulp-inject');
const htmlmin = require('gulp-htmlmin');
const removeHtmlComments = require('gulp-remove-html-comments');

/* Convience Variables */
let dirs = {
	src: "src",					/* The sources code we build from */
	dist: "dist",				/* Where the final files will live */
	maps: "maps", 				/* Source mappings */

    icons_src: "src/icons/**/*.png",    /* Where the icons and MS tiles live */
    fav_icon: "/icons/favicon.ico",     /* Where the favicon.ico lives */
    icons_dist: "dist/icons",

    img_src: "src/img/**/*.+(png|jpg|gif|svg|webp)",
    img_dist: "dist/img",

	ts_src: "src/**/*.ts",
    js_src: "src/**/*.js",
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
        .pipe(gulp.dest(dirs.icons_dist));
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

/* Copy the livereload script */
gulp.task("copy:livereload", () => {
    return gulp.src([
            dirs.src + "/livereload.js"
        ])
        .pipe(gulp.dest(dirs.dist));
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
        .pipe(removeHtmlComments())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dirs.dist));
});

/* Copies the HTML source to dist/ and inject livereload.js into the pages */
gulp.task("copy:html:dev", () => {
    return gulp.src([dirs.html_src])
        .pipe(gulp.dest(dirs.dist))
        .pipe(gulp.src([dirs.html_dist]))
            .pipe(inject(gulp.src(dirs.dist + '/livereload.js', {read: false}), {starttag: '<!-- inject:head:{{ext}} -->', relative: true}))
            .pipe(gulp.dest(dirs.dist));
});

/* Copies the HTML over to dist/ */
gulp.task("html", gulp.series("clean:html", "copy:html"));

/* Copies HTMl to dev and injects the livereload.js into the page. */
gulp.task("html:dev", gulp.series("clean:html", "copy:html:dev"));


/****************
 *  TypeScript  *
*****************/

/* Removes all the js files from dist/ */
gulp.task("clean:js", () => {
	return del(dirs.js_dist);
});

/* Removes all the js files from dist/ except libraries */
gulp.task("clean:js:dev", () => {
    let arr = dirs.js_dist.slice(0, dirs.js_dist.length - 1);
    arr.push("!" + dirs.dist + "/livereload.js");
    return del(arr);
});

/* Checks your code for neatness. See tslint.json for options. */ 
gulp.task("lint:ts", () => {
    return gulp.src([
        	dirs.ts_src
    	])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

/* Transpiles the TypeScript to ES6, minifies it, and moves it to dist/ */
gulp.task("transpile:ts", () => {
    /* Transpile the code */
    var js_code = gulp.src([
        dirs.ts_src
   	])
   	.pipe(sourcemaps.init())
  	.pipe(ts_project(ts.reporter.fullReporter()));

  	/* Minify the code */
    return js_code.js
        .pipe(uglify())
        .pipe(sourcemaps.write(dirs.maps))
        .pipe(gulp.dest(dirs.dist));
});

/* Returns an error code if it fails to build. */
gulp.task("transpile:ts:build", () => {
    /* Transpile the code */
    var js_code = gulp.src([
        dirs.ts_src
    ])
    .pipe(sourcemaps.init())
    .pipe(ts_project(ts.reporter.fullReporter()))
    .on("error", (err) => {
        console.log(err.toString());
        process.exit(1);
    });

    /* Minify the code */
    return js_code.js
        .pipe(uglify())
        .pipe(sourcemaps.write(dirs.maps))
        .pipe(gulp.dest(dirs.dist));
});

/* Lints, builds, minifies and copies the TypeScript files to dist/ */
gulp.task("typescript:build", gulp.series("clean:js", "transpile:ts:build"));
gulp.task("typescript:dev", gulp.series("clean:js:dev", "transpile:ts", "lint:ts"));

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
gulp.task("transpile:scss:build", () => {
  return gulp.src(dirs.scss_src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", (err) => {
        console.log(err.toString());
        process.exit(1);
    }))
    .pipe(clean_css())
    .pipe(sourcemaps.write(dirs.maps))
    .pipe(through2.obj( function( file, enc, cb ) { // Apparently it's a "feature" in Gulp 4 to not update the file modified time. This does that.
        var date = new Date();
        file.stat.atime = date;
        file.stat.mtime = date;
        cb(null, file);
    }))
    .pipe(gulp.dest(dirs.dist));
});

/* Doesn't exit on error - used in the watch task. */
gulp.task("transpile:scss", () => {
  return gulp.src(dirs.scss_src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(clean_css())
    .pipe(sourcemaps.write(dirs.maps))
    .pipe(through2.obj( function( file, enc, cb ) { // Apparently it's a "feature" in Gulp 4 to not update the file modified time. This does that.
        var date = new Date();
        file.stat.atime = date;
        file.stat.mtime = date;
        cb(null, file);
    }))
    .pipe(gulp.dest(dirs.dist));
});

gulp.task("styles", gulp.series("clean:css", "transpile:scss"));
gulp.task("styles:build", gulp.series("clean:css", "transpile:scss:build"));

/* Lints the program, builds, minifies and copies it to /dist */
gulp.task("build", gulp.parallel("html", "typescript:build", "styles:build", "copy:misc"));
gulp.task("build:dev", gulp.series("copy:livereload", gulp.parallel("html:dev", "typescript:dev", "styles:build", "copy:misc")));
gulp.task("default", gulp.parallel("build"));

/* Watches for changes and then rebuilds */
gulp.task("watch", gulp.series("build:dev", () => {
    watch(dirs.html_src, gulp.series("html:dev"));
    watch(dirs.scss_src, gulp.series("styles"));
    watch(dirs.ts_src, gulp.series("typescript:dev"));

    watch(dirs.src + "/icons/site.webmanifest", gulp.series("copy:manifest"));
    watch(dirs.src + "/browserconfig.xml", gulp.series("copy:browserconfig"));
    watch(dirs.src + "/robots.txt", gulp.series("copy:robots"));
    watch(dirs.src + "/humans.txt", gulp.series("copy:humans"));
    watch(dirs.src + dirs.fav_icon, gulp.series("copy:ico"));
    watch(dirs.icons_src, gulp.series("copy:icons"));
    watch(dirs.img_src, gulp.series("copy:images"));
}));