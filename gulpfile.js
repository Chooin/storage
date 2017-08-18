var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify')
    del = require('del');

gulp.task('build', function () {
	del(['./dist']);
	return gulp.src('./lib/index.js')
					   .pipe(babel({
						    presets: ['es2015']
					    }))
					   .pipe(uglify())
					   .pipe(gulp.dest('./dist'));
});