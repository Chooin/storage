var gulp = require('gulp'),
    babel = require('gulp-babel'),
    jshint = require('gulp-jshint'),
    del = require('del');

gulp.task('build', function () {
	del(['./dist/*']);
	return gulp.src('./lib/index.js')
		         .pipe(jshint())
					   .pipe(babel({
						    presets: ['es2015']
					    }))
					   .pipe(gulp.dest('./dist'));
});