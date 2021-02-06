//Required Packages for Gulp environment setup
const { src, dest, series, parallel, watch } = require("gulp");
const imagemin = require("gulp-imagemin");
const imageminPngQuant = require("imagemin-pngquant");
const imageminJpegRecompress = require("imagemin-jpeg-recompress");
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require("gulp-autoprefixer");
// const lineEnd = require("gulp-line-ending-corrector");
const browserSync = require("browser-sync").create();
const del = require("del");
var csso = require('gulp-csso');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');

//HTML Path
const htmlSrc = "src/**/*.html";
const htmlDist = "dist/";
const htmlWatch = "dist/**/*.html";

//Favicon Path
const faviconSrc = "src/*.png";
const faviconDist = "dist/";

// PHP Path
// const phpSrc ="src/**/**/*.php";
// const phpDist = "dist/"

//Fonts Path
// const fontSrc = "src/assets/fonts/*";
// const fontDist = "dist/assets/fonts/";
// const fontWatch = "dist/assets/fonts/**/*";

//Image Path
const imgSrc = "src/assets/img/**/*";
const imgDist = "dist/assets/img/";
const imgWatch = "dist/assets/img/**/*";

//SASS Path
const sassSrc = "src/assets/sass/style.scss";
const sassDist = "dist/assets/css/";
const sassSrcWatch = "src/assets/sass/**/*";
const sassWatch = "src/assets/sass/**/*";

//CSS Path
const cssSrc = "src/assets/css/**/*.*";
const cssDist = "dist/assets/css/";
const cssWatch = "dist/assets/css/**/*";

//JS Path
const jsSrc = "src/assets/js/**/*.js";
const jsDist = "dist/assets/js/";
const jsWatch = "dist/assets/js/**/*";

//Plugins Path
const pluginsSrc = "src/assets/plugins/**/*.*";
const pluginsDist = "dist/assets/plugins";
const pluginsWatch = "dist/assets/plugins/**/*";

//Bootstrap Path
const bootstrapSrc = "src/assets/bootstrap/**/*.*";
const bootstrapDist = "dist/assets/bootstrap";
const bootstrapWatch = "dist/assets/bootstrap/**/*";

//IcoFont Path
// const icofontSrc = "src/assets/icofont/**/*.*";
// const icofontDist = "dist/assets/icofont";
// const icofontWatch = "dist/assets/icofont/**/*";

//Fonts Path
const fontsSrc = "src/assets/fonts/**/*.*";
const fontsDist = "dist/assets/fonts";
const fontsWatch = "dist/assets/fonts/**/*";

//HTML
function html() {
    return src(htmlSrc)
    // .pipe(htmlmin({
    //     collapseWhitespace: true,
    //     removeComments: true
    // }))
    .pipe(dest(htmlDist));
}

//php
// function php() {
//     return src(phpSrc).pipe(dest(phpDist));
// }

//favicon
function favicon() {
    return src(faviconSrc).pipe(dest(faviconDist));
}

//Fonts
// function fonts() {
//     return src(fontSrc).pipe(dest(fontDist));
// }

//Bootstrap
function bootstrap() {
    return src(bootstrapSrc).pipe(dest(bootstrapDist));
}

//IcoFont
// function icofont() {
//     return src(icofontSrc).pipe(dest(icofontDist));
// }

//Fonts
function fonts() {
    return src(fontsSrc).pipe(dest(fontsDist));
}

//Images
function img() {
    return src(imgSrc).pipe(dest(imgDist))
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imageminPngQuant(),
                imageminJpegRecompress()
            ])
        )
        
}


//SASS
function style() {
    return src(sassSrc)
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle: "expanded"
            }).on("error", sass.logError)
        )
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        // .pipe(csso())
        .pipe(dest(sassDist))
        .pipe(browserSync.stream());
}

//css
function css() {
    return src(cssSrc).pipe(dest(cssDist));
}

//JS
function js() {
    return src(jsSrc)
    // .pipe(uglify())
    .pipe(dest(jsDist));
}

//Plugins
function plugins() {
    return src(pluginsSrc).pipe(dest(pluginsDist));
}

//Clean distribution Folder before watch
function clean(done) {
    del.sync(["./dist"]);
    done();
}

//Browser Sync Server
function serv() {
    return (
        browserSync.init({
            server: {
                baseDir: "./dist/"
            },
            notify: false
        }),
        watch(htmlSrc, html),
        //watch(fontSrc, fonts),
        watch(imgSrc, img),
        watch(sassSrcWatch, style),
        watch(cssSrc, css),
        watch(jsSrc, js),
        watch(pluginsSrc, plugins),
        watch(bootstrapSrc, bootstrap),
        // watch(icofontSrc, icofont),
        watch(fontsSrc, fonts),
        watch([htmlWatch, imgWatch, sassWatch, cssWatch, jsWatch, pluginsWatch, bootstrapWatch, fontsWatch]).on(
            "change",
            browserSync.reload
        )
    );
}

//Exports
exports.html = html;
//exports.php = php;
exports.bootstrap = bootstrap;
// exports.icofont = icofont;
exports.fonts = fonts;
exports.favicon = favicon;
//exports.fonts = fonts;
exports.img = img;
exports.style = style;
exports.css = css;
exports.js = js;
exports.plugins = plugins;
exports.clean = clean;
exports.serv = serv;
//Exports Default
exports.default = series(clean, parallel(html, favicon, img, style, css, js, plugins, bootstrap, fonts), serv);