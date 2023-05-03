import gulp from 'gulp'
import base64 from 'gulp-base64'
// import sass from 'gulp-sass' // node version: 12.22.8 - "gulp-sass": "^4.1.0"
const sass = require('gulp-sass')(require('node-sass'))
import autoprefixer from 'gulp-autoprefixer'
import fileinclude from 'gulp-file-include'
import del from 'del'
import browserSync from 'browser-sync'
import concat from 'gulp-concat'
import babelify from 'babelify'
import bro from 'gulp-bro'
import uglify from 'gulp-uglify'

/**
 * node version: 16.15.1(stable)
 */

const server = browserSync.create()
const clean = () => {return del(['dist'])}

const scssOptions = { // Sass compile option
  outputStyle: 'compact',
  indentType: 'space',
  indentWidth: 2,
  precision: 6,
  sourceComments: false
}

const src = 'src'
const dist = 'dist'
const paths = {
  scripts: [`${src}/**/*.js`, `!${src}/js/plugins/*.js`],
  plugins: [`${src}/js/plugins/*.js`],
  scss: `${src}/**/*.scss`,
  html: `${src}/**/*.html`,
  image: `${src}/**/*.{png,jpg,jpeg,gif,svg,ico,mp4}`,
  font: `${src}/**/*.{ttf,otf,woff,woff2,eot,svg}`,
  data: `${src}/**/*.{pdf,zip,ai,json,docx}`
}

const htmlIncludeOptions = {
  prefix: '@@',
  basepath: '@file',
  indent: true
}

function htmlInclude() {
  return gulp.src([paths.html, '!src/html/inc/*.html', '!src/html_en/inc/*.html'])
    .pipe(fileinclude(htmlIncludeOptions))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream())
}

function style() {
  return gulp.src(paths.scss, {sourcemaps: true})
    .pipe(sass(scssOptions).on('error', sass.logError))
    .pipe(base64({
      extensions: ['svg', 'png', /\.jpg#datauri$/i],
      maxImageSize: 1024,
      debug: true
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(dist, {sourcemaps: '/maps'}))
    .pipe(browserSync.stream())
}

function scripts() {
  return gulp.src(paths.scripts, {sourcemaps: true})
    // .pipe(bro({
    //   transform: [
    //     babelify.configure({ presets: ['@babel/preset-env'] }),
    //   ]
    // }))
    // .pipe(uglify({toplevel: true}))
    .pipe(gulp.dest(dist))
}

function plugins() {
  return gulp.src(paths.plugins, { sourcemaps: true })
    // .pipe(uglify({toplevel: true}))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest(dist+'/js/'))
}

function copyImage() {
  return gulp.src(paths.image, {since: gulp.lastRun(copyImage)})
    .pipe(gulp.dest(dist))
}

function copyFonts() {
  return gulp.src(paths.font, {since: gulp.lastRun(copyFonts)})
    .pipe(gulp.dest(dist))
}

function copyData() {
  return gulp.src(paths.data, {since: gulp.lastRun(copyData)})
    .pipe(gulp.dest(dist))
}

function watchFiles(done) {
  server.init({
    server: './dist/',
    port: 5000,
    open: false
  })
  done()
  gulp.watch(paths.html, htmlInclude)
  gulp.watch(paths.scss, style)
  gulp.watch(paths.scripts, scripts)
  gulp.watch(paths.plugins, plugins)
  gulp.watch(paths.image, copyImage)
  gulp.watch(paths.font, copyFonts)
  gulp.watch(paths.data, copyData)
}

const watch = gulp.parallel(watchFiles)
const build = gulp.series(clean, gulp.parallel(htmlInclude, style, scripts, plugins, copyImage, copyFonts, copyData))
const dataBuild = gulp.parallel(copyImage, copyFonts, copyData)

// build
exports.build = build

// dev
export const dev = gulp.series([build, watch]);
export const data = gulp.series([dataBuild])



// exports.watch = watch
// exports.build = build
// exports.default = build
