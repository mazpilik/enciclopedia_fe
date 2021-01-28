const {watch, src, dest, series, parallel} = require('gulp');
const del = require('delete');
const sass = require('gulp-dart-sass');
const pleeease = require('gulp-pleeease');
const sassdoc = require('sassdoc');
const rename = require('gulp-rename');
const ssh = require('gulp-ssh');
const processhtml = require('gulp-processhtml');
const autoprefix = require('gulp-autoprefixer');

function borrar(cb){
  del('./dist/*');
  cb();
}

function build_css(){
  return src("scss/base.scss")
  .pipe(sass())
  .pipe(pleeease())
  .pipe(
    rename({
      basename:"styles",
      suffix:".min",
      extname:".css"
    }))
    .pipe(dest('dist/css/'));
}

function build_docs(){
  const doc_options = {
    dest: "./dist/docs",
    verbose: true
  }
  return src("./scss/*.scss")
  .pipe(sassdoc(doc_options));
}

function mover_img(){
  return src('./img/*')
  .pipe(dest('./dist/img'));
}

function mover_html(){
  return src('./index.html')
  .pipe(processhtml())
  .pipe(dest('.dist'));
}

exports.borrar = borrar;
exports.build_css = build_css;
exports.build_docs = build_docs;
exports.mover_img = mover_img;
exports.mover_html = mover_html;
exports.proceso = series(
  borrar,
  parallel(build_css,build_docs),
  parallel(mover_img, mover_html)
);
exports.default = function(){
  watch('./scss/*.scss', build_css);
}