var bs          = require('browser-sync').create();
var sass        = require('./sass');
var paths       = require('./paths');
var injector    = require('bs-html-injector');
var crossbow    = require('./crossbow');
var watchConfig = {ignoreInitial: true};

/**
 * Register HTML injector with BrowserSync
 */
bs.use(injector);

/**
 * Local Server from app root
 */
bs.init({server: true, logFileChanges: false});

/**
 * Watch and compile SASS tasks
 */
bs.watch('scss', watchConfig, function () {
    console.time('sass');
    sass()
        .then(function () {
            bs.reload(paths.sass.output);
            console.timeEnd('sass');
        })
        .catch(browserError)
        .done();
});

/**
 * Watch and compile SASS tasks
 */
bs.watch('src', watchConfig, function () {
    crossbow()
        .then(injector)
        .catch(browserError)
        .done();
});

/**
 * Helper for console/browser Errors
 * @param err
 */
function browserError (err) {
    console.error(err);
    bs.notify(err.message);
}

/**
 * Also Export BrowserSync instance
 * @type {Object|*}
 */
module.exports = bs;