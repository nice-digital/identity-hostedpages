const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const css = require('gulp-inline-css');

function compileSCSS() {
    return src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./src/css'));
}

function inlineCSS() {
    return src('./src/*.html')
        .pipe(css({
            preserveMediaQueries: true,
            removeStyleTags: false
        }))
        .pipe(dest('./'));
}

exports.compileSCSS = compileSCSS;
exports.inlineCSS = inlineCSS;
exports.watch = function() {
    watch(['./src/scss/**/*.scss', './src/*.html'], { ignoreInitial: false }, series(compileSCSS, inlineCSS));
};
exports.default = series(compileSCSS, inlineCSS);