var gulp = require('gulp'),
    babel = require('gulp-babel'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    del = require('del');

gulp.task('build', function () {
	del(['./dist/*']);
	return gulp.src('./lib/storage.js')
	.pipe(jshint())
	.pipe(babel({
		presets: ['es2015']
	}))
  // .pipe(uglify())
	.pipe(gulp.dest('./dist'));
});
