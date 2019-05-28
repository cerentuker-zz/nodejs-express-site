var gulp = require('gulp');
//SCSS lint
let sassLint = require("gulp-sass-lint"),
path = require("path"),
yargs = require("yargs"),
argv = yargs.argv;

// generate js
gulp.task("js", () => {
    var optBrfy = {"debug" : true};

    // Needed when task is run from Jenkins so that Browserify can resolve the modules installed with NPM
    if (argv.JenkinsBuild) {
        optBrfy = xtend(optBrfy, {"paths" : [argv.JenkinsNodeModulesPath]});
    }

    JS_PATHS.forEach(function(p) {
        var srcPath = path.join(rootPath, p.src),
            dstPath = path.join(rootPath, p.dst),
            bundleSrc = p.bsrc;

        var bundler = browserify(srcPath, optBrfy).transform(babelify, {presets: ["es2015"]});

        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source(bundleSrc))
            .pipe(buffer())
            .pipe(gulpSourcemaps.init({ loadMaps: true }))
            .pipe(gulpSourcemaps.write('./'))
            .pipe(gulp.dest(dstPath));
    });
});

// generate css
gulp.task("scss", () => {
    var streams = mergeStream(),
        postCssProcessors;

    SCSS_PATHS.forEach(function(p) {
        var srcPath = path.join(rootPath, p.src),
            dstPath = path.join(rootPath, p.dst);

            postCssProcessors = [
                autoprefixer({browsers: ['> 0.1%']}),
                mqpacker({
                    sort: true
                })
            ];

        streams.add(gulp.src(srcPath)
            .pipe(gulpSourcemaps.init())
            .pipe(gulpSass().on('error', gulpSass.logError))
            .pipe(postcss(postCssProcessors))
            .pipe(gulpSourcemaps.write('./'))
            .pipe(gulp.dest(dstPath)));
    });

    return streams;
});
