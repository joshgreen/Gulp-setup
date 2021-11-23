var gulp = require('gulp'),
  watch = require('gulp-watch'),
  sass = require('gulp-sass')(require('sass')),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  cachebust = require('gulp-cache-bust'),
  browserSync = require('browser-sync').create();

const paths = {
  styles: {
    src: 'wp-content/themes/pascal/sass/*.sass',
    dest: 'wp-content/themes/pascal'
  },
  scripts: {
    src: 'wp-content/themes/pascal/js/*.js',
    dest: 'wp-content/themes/pascal/js/min'
  },
  svg: {
    src: 'wp-content/themes/pascal/icons/*.svg'
  },
  php: {
    src: 'wp-content/themes/pascal/*.php'
  }
};


// automatically reloads the page when files changed
var browserSyncWatchFiles = [
  'wp-content/themes/pascal/sass/*.sass',
  'wp-content/themes/pascal/js/*.js',
  'wp-content/themes/pascal/*.php'
];

// see: https://www.browsersync.io/docs/options/
var browserSyncOptions = {
  watchTask: true,
  proxy: "https://joshgreendesign.dev"
};

// function watch() {
//   browserSync.init({
//     proxy: "https://joshgreendesign.dev"
//   });
//   // gulp.watch(paths.styles.src, style);
//   // gulp.watch(paths.scripts.src, doScripts);
//   // gulp.watch(paths.svg.src, doSvg);
//   gulp.watch(paths.php.src, reload);
// }

gulp.task('styles', function () {
  return gulp.src(paths.styles.src)
    .pipe(sass({
      errLogToConsole: true,
      precision: 8,
      noCache: true,
    }).on('error', sass.logError))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename({
      basename: "style"
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('compress', function () {
  return gulp.src(paths.scripts.src)
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.src))
    .pipe(browserSync.reload({ stream: true }));
});


gulp.task('cache', function() {
    // content
  return gulp.src('./*.php')
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('browser-sync', function () {
  browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});

gulp.task('watch', function () {
  gulp.watch(paths.styles.src, gulp.parallel('styles'));
  gulp.watch(paths.scripts.src, gulp.parallel('compress'));
});


gulp.task('default', gulp.parallel('watch', 'cache', 'browser-sync'));