const gulp = require('gulp');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const less = require('gulp-less');
const minifyCSS = require('gulp-minify-css');
const rename = require('gulp-rename');
const del = require('del'); // Switched from rimraf to del

const paths = {
  fonts: 'fonts/**.*',
  images: 'img/**/*.*',
  styles: 'less/**/*.less',
};

function clean() {
  return del(['dist']);
}

function cleanCss() {
  return del(['dist/css/*']);
}

function cleanImages() {
  return del(['dist/img/*']);
}

function cleanFonts() {
  return del(['dist/fonts/*']);
}

function fonts() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('dist/fonts'));
}

function compileLess() {
  return gulp.src(paths.styles)
    .pipe(less())
    .pipe(concat('rdash.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(minifyCSS())
    .pipe(rename('rdash.min.css'))
    .pipe(gulp.dest('dist/css'));
}

function livereload() {
  return gulp.src('*.html')
    .pipe(connect.reload());
}

function watchTasks() {
  gulp.watch(paths.styles, gulp.series(compileLess, livereload));
  gulp.watch(paths.fonts, gulp.series(fonts, livereload));
}

function connectServer() {
  return connect.server({
    root: 'dist',
    livereload: true,
    port: 8888
  });
}

const build = gulp.series(
  gulp.parallel(cleanCss, cleanImages, cleanFonts, clean),
  gulp.parallel(fonts, compileLess)
);

const watch = gulp.parallel(watchTasks, connectServer);

exports.clean = clean;
exports.fonts = fonts;
exports.less = compileLess;
exports.livereload = livereload;
exports.watch = watchTasks;
exports.connect = connectServer;
exports.build = build;
exports.default = gulp.series(build, watch);
