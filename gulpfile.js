var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require('gulp-concat');
var minify = require('gulp-minify');

gulp.task("default", function () {
  return gulp.src("./src/**/*.js")
  .pipe(babel({
          presets: ['babel-preset-es2015']
    }))

    .pipe(concat("DataOcean.js"))
    .pipe(gulp.dest("js"))
    // can be more than one destination. Please change path.
});

//   .pipe(minify())
