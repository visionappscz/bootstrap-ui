var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var del = require('del');
var eslint = require('gulp-eslint');
var exec = require('gulp-exec');
var gulp = require('gulp');
var pjson = require('./package.json');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var stylelint = require('gulp-stylelint');
var uglify = require('gulp-uglify');

function cleanCSS() {
  return del('dist/css');
}

function lintCSS() {
  return gulp
    .src(['src/scss/**/*.scss'])
    .pipe(stylelint({
      reporters: [
        {
          console: true,
          formatter: 'string',
        },
      ],
    }));
}

function buildCSS() {
  return gulp
    .src('src/scss/bootstrap-ui.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(concat('bootstrap-ui.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'));
}

function minifyCSS() {
  return gulp
    .src('dist/css/bootstrap-ui.css')
    .pipe(sourcemaps.init())
    .pipe(csso())
    .pipe(concat('bootstrap-ui.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

function cleanJS() {
  return del('dist/js');
}

function lintJS() {
  return gulp
    .src([
      'src/js/*.js',
      'src/js/tests/unit/*.js',
      'gulpfile.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}

function buildJS() {
  return gulp
    .src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('bootstrap-ui.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
}

function minifyJS() {
  return gulp
    .src('dist/js/bootstrap-ui.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('bootstrap-ui.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
}

function cleanImages() {
  return del('dist/images');
}

function copyImages() {
  return gulp
    .src('src/images/**')
    .pipe(gulp.dest('dist/images'));
}

function runBrowserSync(done) {
  browserSync.init({
    open: false,
    server: {
      baseDir: './styleguide/',
    },
  }, done);
}

function watchCSS() {
  gulp.watch('src/scss/**/*.scss', gulp.parallel('lint-css', 'build-css'));
}

function watchJS() {
  gulp.watch('src/js/**/*.js', gulp.parallel('lint-js', 'build-js'));
}

function cleanSG() {
  return del(['.tmp', 'styleguide']);
}

function replaceSG() {
  return gulp
    .src(['src/styleguide/index.hbs'])
    .pipe(replace('%VERSION%', pjson.version))
    .pipe(replace('%YEAR%', (new Date()).getFullYear()))
    .pipe(gulp.dest('.tmp/styleguide'));
}

function styleSG() {
  return gulp
    .src('src/styleguide/kss-assets/scss/kss.scss', {
      sourcemaps: true,
    })
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(concat('kss.css'))
    .pipe(gulp.dest('styleguide/kss-assets/css'));
}

function minifySG() {
  return gulp
    .src('styleguide/kss-assets/css/kss.css')
    .pipe(csso())
    .pipe(concat('kss.min.css'))
    .pipe(gulp.dest('styleguide/kss-assets/css'))
    .pipe(browserSync.stream());
}

function copySGBUI() {
  return gulp
    .src('dist/**')
    .pipe(gulp.dest('styleguide/assets'));
}

function copySGNPM() {
  return gulp
    .src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/moment/min/moment-with-locales.min.js',
      'node_modules/bootstrap/dist/js/**'
    ])
    .pipe(gulp.dest('styleguide/assets/js'));
}

function copySGJS() {
  return gulp
    .src('src/styleguide/kss-assets/js/**')
    .pipe(gulp.dest('styleguide//kss-assets/js'));
}

function copySGCKE() {
  return gulp
    .src('node_modules/ckeditor/**')
    .pipe(gulp.dest('styleguide/assets/vendor/ckeditor'));
}

function buildSG() {
  return gulp.src('.tmp/styleguide')
    .pipe(exec('node node_modules/kss/bin/kss src/scss styleguide --builder .tmp/styleguide'))
    .pipe(exec.reporter());
}

gulp.task('lint-css', lintCSS);
gulp.task('build-css', gulp.series(cleanCSS, buildCSS, minifyCSS));
gulp.task('lint-js', lintJS);
gulp.task('build-js', gulp.series(cleanJS, buildJS, minifyJS));
gulp.task('copy-images', gulp.series(cleanImages, copyImages));
gulp.task('watch', gulp.parallel(watchCSS, watchJS));
gulp.task('default', gulp.parallel('lint-css', 'build-css', 'lint-js', 'build-js', 'copy-images'));
gulp.task('build-styleguide',
  gulp.series(
    cleanSG,
    replaceSG,
    styleSG,
    minifySG,
    gulp.parallel(
      copySGBUI,
      copySGNPM,
      copySGJS,
      copySGCKE
    ),
    buildSG
  )
);
gulp.task('styleguide', gulp.series('default', 'build-styleguide'));
gulp.task('serve', gulp.series('styleguide', runBrowserSync, 'watch'));
