var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var clip = require('gulp-clip-empty-files');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var rename = require('gulp-rename');
var _ = require('lodash');
var del = require('del');


gulp.task('default', ['styles']);

gulp.task('styles:clean', function(callback) {
	del(['./web/stylesheets/build/**'], callback);
});

gulp.task('styles:copy-css', ['styles:clean'], function(){
	return gulp.src('./web/stylesheets/src/**/*.css')
		.pipe(gulp.dest('./web/stylesheets/build'));
});

gulp.task('styles:build-scss', ['styles:copy-css'], function() {
	return gulp.src('./web/stylesheets/src/**/*.scss')
		.pipe(clip())
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 2 versions', 'ie >= 8'],
			cascade: false
		}))
		.pipe(gulp.dest('./web/stylesheets/build'));
});

gulp.task('iconfont', function(){
	return gulp.src('./font-glyphs/src/icons/*.svg')
		.pipe(iconfont({
			fontName: 'vp-glyph-font', // required
			appendCodepoints: true, // recommended option
			startCodepoint: 0xF101,
			fontHeight: 150
		}))
		.on('codepoints', function(codepoints, options) {
			codepoints = _.map(codepoints, function(codepoint) {
				return {
					name: codepoint.name,
					codepoint: codepoint.codepoint.toString(16).toLowerCase()
				};
			});
			gulp.src('./font-glyphs/src/templates/_iconfont.scsstpl')
				.pipe(consolidate('lodash', {
					glyphs: codepoints
				}))
				.pipe(rename('_font-glyph-entities.scss'))
				.pipe(gulp.dest('./web/stylesheets/src/config/'));
		})
		.pipe(gulp.dest('./web/design/fonts/glyph-lib/'));
});

gulp.task('styles', ['styles:build-scss']);