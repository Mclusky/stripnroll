const gulp = require('gulp');
const inject = require('gulp-inject');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const iife = require('gulp-iife');
const minify = require('gulp-minify');
const htmlclean = require('gulp-htmlclean');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const watchify = require('watchify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const sourcemaps = require('gulp-sourcemaps');
const glob = require('glob');
const es = require('event-stream');
const flatten = require('gulp-flatten');

const paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcJSON: 'src/assets/**/*.json',
    srcCSS: 'src/assets/**/styles.sass',
    srcJS: 'src/assets/js/*.js',
    srcMod: 'src/assets/js/modules/*.js',
    srcImg: 'src/assets/images/**',
    srcMp3: 'src/assets/music/**',
    srcVendors: 'src/vendors/**',

    tmp: 'tmp',
    tmpAssets: 'tmp/assets',
    tmpAssetsJS: 'tmp/assets/js',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/assets/**/*.css',
    tmpJS: 'tmp/assets/**/*.js',
    tmpImg: 'tmp/assets/images',
    tmpMp3: 'tmp/assets/music',
    tmpVendors: 'tmp/vendors',

    dist: 'dist',
    distAssets: 'dist/assets',
    distIndex: 'dist/index.html',
    distCSS: 'dist/assets/styles/*.css',
    distJS: 'dist/assets/js/*.js',
    distImg: 'dist/assets/images',
    distMp3: 'dist/assets/music',
    distVendors: 'dist/vendors'
};
const sources = ['src/']
//*******************GULP TASKS*******************//
//***************DEVELOPMENT**********************//
//Copy html files//
gulp.task('html', () => {
    return gulp.src(paths.srcHTML)
        .pipe(gulp.dest(paths.tmp));
});
//Copy favicon//
gulp.task('favicon', () => {
    return gulp.src('src/favicon.png')
        .pipe(gulp.dest(paths.tmp));
});
//Copy JSON files
gulp.task('json', () => {
    return gulp.src(paths.srcJSON)
        .pipe(gulp.dest(paths.tmpAssets));
})
//Compile Sass files//
gulp.task('css', () => {
    return gulp.src(paths.srcCSS)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.tmpAssets));
});
//Copy js files
gulp.task('scripts', () => {
    return gulp.src(paths.srcJS)
        .pipe(gulp.dest(paths.tmpAssetsJS));
});
//Bundle JS files with modules
gulp.task('browserify', done => {
    glob(paths.srcMod, (err, files) => {
        if (err) done(err);
        const tasks = files.map(entry => {
            const b = browserify({
                    entries: [entry],
                    extensions: ['.js'],
                    debug: true,
                    cache: {},
                    packageCache: {},
                    fullPaths: false
                })
                .transform(babelify)
                .plugin(watchify);

            const bundle = () => {
                return b.bundle()
                    .pipe(source(entry), {
                        base: '.'
                    })
                    .pipe(buffer())
                    .pipe(flatten())
                    .pipe(sourcemaps.init({
                        loadMaps: true
                    }))
                    .pipe(sourcemaps.write('./'))
                    .pipe(gulp.dest(paths.tmpAssetsJS))
            };
            b.on('update', bundle);
            return bundle();
        });
        es.merge(tasks).on('end', done);
    })
});
//Copy assets
gulp.task('img', () => {
    return gulp.src(paths.srcImg).pipe(gulp.dest(paths.tmpImg));
});

gulp.task('mp3', () => {
    return gulp.src(paths.srcMp3).pipe(gulp.dest(paths.tmpMp3));
});

gulp.task('vendors', () => {
    return gulp.src(paths.srcVendors).pipe(gulp.dest(paths.tmpVendors));
});

gulp.task('copy', ['html', 'favicon', 'json', 'css', 'browserify', 'img', 'mp3', 'vendors']);

gulp.task('inject', ['copy'], () => {
    const css = gulp.src(paths.tmpCSS);
    const js = gulp.src(paths.tmpJS);
    return gulp.src(paths.tmpIndex)
        .pipe(inject(css, {
            relative: true
        }))
        .pipe(inject(js, {
            relative: true
        }))
        .pipe(gulp.dest(paths.tmp))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['inject'], () => {
    browserSync.init({
        server: {
            baseDir: "./tmp"
        }
    });
    gulp.watch(paths.src, ['inject']);
});

gulp.task('default', ['serve']);
//*********************END OF DEVELOPMENT***************//

//*******************DISTRIBUTION**********************//
gulp.task('html:dist', () => {
    return gulp.src(paths.srcHTML)
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist));
});
gulp.task('favicon:dist', () => {
    return gulp.src('src/favicon.png')
        .pipe(gulp.dest(paths.dist));
});
gulp.task('css:dist', () => {
    return gulp.src(paths.srcCSS)
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.distAssets));
});
gulp.task('json:dist', () => {
    return gulp.src(paths.srcJSON)
        .pipe(gulp.dest(paths.distAssets));
})
// gulp.task('js:dist', () => {
//     return gulp.src(paths.tmpJS)
//         .pipe(concat('js/main.js'))
//         .pipe(minify())
//         .pipe(iife({
//             useStrict: true,
//             trimCode: true,
//         }))
//         .pipe(gulp.dest(paths.distAssets));
// });

//Browserify and minify in one task//
gulp.task('browserify:dist', () => {
  glob(paths.srcMod, (err, files) => {
    if (err) done(err);
    const b = browserify();
    files.forEach( (file) => {
      b.add(file);
    });
      b.transform(babelify)
        .bundle()
        .pipe(source('js/main.js'))
        .pipe(buffer())
        .pipe(minify())
        .pipe(iife({
          useStrict: true,
          trimCode: true,
        }))
        .pipe(gulp.dest(paths.distAssets));
  });
});

gulp.task('dist:img', () => {
    return gulp.src(paths.srcImg).pipe(gulp.dest(paths.distImg));
});

gulp.task('dist:mp3', () => {
    return gulp.src(paths.srcMp3).pipe(gulp.dest(paths.distMp3));
});

gulp.task('dist:vendors', () => {
    return gulp.src(paths.srcVendors).pipe(gulp.dest(paths.distVendors));
});

gulp.task('copy:dist', ['html:dist', 'favicon:dist', 'css:dist', 'json:dist', 'browserify:dist', 'dist:img', 'dist:mp3', 'dist:vendors']);
gulp.task('create:dist', ['copy:dist'], () => {
    const cssDist = gulp.src(paths.distCSS);
    const jsDist = gulp.src('dist/assets/js/main-min.js');
    return gulp.src(paths.distIndex)
        .pipe(inject(cssDist, {
            relative: true
        }))
        .pipe(inject(jsDist, {
            relative: true
        }))
        .pipe(gulp.dest(paths.dist));
});
gulp.task('build', ['create:dist']);

//*****************END OF DISTRIBUTION*********************//

gulp.task('clean', () => {
    del([paths.tmp, paths.dist]);
});
