var gulp 		= require('gulp');
var pug 		= require('gulp-pug');
var sass 		= require('gulp-sass');
var prettUrl	= require('gulp-pretty-url');
var sourcemaps	= require('gulp-sourcemaps');
var browserify 	= require('browserify');
var source		= require('vinyl-source-stream');
var buffer		= require('vinyl-buffer');
var sourcemaps 	= require('gulp-sourcemaps');
var sass 		= require('gulp-sass');
var uglify 		= require('gulp-uglify');
var del			= require('del');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;


gulp.task('templates', function() {
	return gulp.src('./src/views/pages/**/*.pug')
	.pipe(pug({
		basedir: './src/views/',
		pretty: true,
		locals:{}
	}))
	.pipe(prettUrl())
	.pipe(gulp.dest('build/'));
});

gulp.task('sass-dist', function() {
	gulp.src('src/sass/**/*.scss')
	.pipe(sourcemaps.init({loadMaps:true}))
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('build/css/'))
});

gulp.task('sass-dev', function() {
	gulp.src('src/sass/**/*.scss')
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/css/'))
		.pipe(browserSync.stream());
});

gulp.task('scripts-dist', function() {
	return browserify({ entries: ['src/scripts/main.js'], debug:true })
		.bundle()
		.pipe(source('bundled.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(uglify({
			// preserveComments:'all'
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/js/'))
});

gulp.task('scripts-dev', function() {
	return browserify({ entries: ['src/scripts/main.js'], debug:true })
		.bundle()
		.pipe(source('bundled.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/js/'))
});

gulp.task('clean', function(){
	return del(['build/**/*']);
});

gulp.task('watch', ['templates', 'sass-dev', 'scripts-dev'], function(){
	gulp.watch('src/views/**/*', ['templates']);
	gulp.watch('src/sass/**/*', ['sass-dev']);
	gulp.watch('src/scripts/**/*', ['scripts-dev']);

});


gulp.task('build', ['clean'], function(){
	gulp.start('templates');
	gulp.start('sass-dist');
	gulp.start('scripts-dist');
});


// Static server
gulp.task('serve', ['watch'], function() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });

	gulp.watch("build/**/*.html").on("change", reload);
});
