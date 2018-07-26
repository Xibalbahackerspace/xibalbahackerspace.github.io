
///* Including plugins and dependencies
///* ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~
var gulp = require('gulp')
var stylus = require('gulp-stylus')
var rename = require("gulp-rename")
var uglify = require("gulp-uglify")
var cssnano = require('gulp-cssnano')
var browserSync = require('browser-sync').create()
var config = {
    env: 'dev',
    version: 1
}


///* Copy vendor modules
///* ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~
gulp.task('vendor', () => {

    ///* LesliCSS
    gulp.src('./node_modules/leslicss/src/**/*')
    .pipe(gulp.dest('./_assetsrc/vendor/lesli/src/'))

    ///* LesliCSS loader
    gulp.src('./node_modules/leslicss/index.styl')
    .pipe(gulp.dest('./_assetsrc/vendor/lesli/'))

})


///* Compile stylus to css
///* ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~
gulp.task('stylus', () => {

    // * Compile styl to css
    let task = gulp
    .src(['./_assetsrc/stylus/*.styl'])
    .pipe(stylus({'include css': true, compress: false}))
    .pipe(gulp.dest('./css/'))

    // * Minify css only for production
    if (config.env == 'prod') {

        task.pipe(csso())
        .pipe(rename({suffix: '.' + (config.version).replace('.', '') + '.min'}))
        .pipe(gulp.dest('./css/'))

    }

})


///* Minify JavaScript
///* ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~
gulp.task('scripts', () => {

    // * Compile javascript app
    webpack(webpackConfig, () => {

        // * Compile JS to lower version
        // * Uglify JS only for production
        if (config.env == 'prod') {
            
            gulp
            .src(['./_assetsrc/js/*.js'])
            .pipe(babel({compact: false, "presets": ["es2015"]}))
            .pipe(uglify())
            .pipe(rename({suffix: '.' + (config.version).replace('.', '') + '.min'}))
            .pipe(gulp.dest('./js/'))

        }

    })

})


///* Starting sync browser proxy
///* ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~
gulp.task('server', () => {

    browserSync.init({proxy:"http://127.0.0.1",ui:{port:8081},port:8080})
    gulp.watch('./_site/**/*.*').on('change', browserSync.reload)
    gulp.watch('./_site/*.*').on('change', browserSync.reload)

})


///* Initialize watchers
///* ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~
gulp.task('watch', () => {

    gulp.watch('./_assetsrc/js/*.js', ['scripts'])
    gulp.watch('./_assetsrc/stylus/*.styl', ['stylus'])

})


///* Running default tasks
///* ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~
gulp.task('default', ['vendor', 'stylus', 'scripts'])


///* Run dev tasks
///* ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~  ~·~
gulp.task('dev', ['server', 'watch'])
