var crossbow = require('crossbow');
var vfs      = require('vinyl-fs');
var prom     = require('prom-seq');
var paths    = require('./paths');

/**
 * Define the tasks that make up a build
 * @type {Object}
 */
var builder = prom.create([build]);

/**
 * Build Crossbow
 * @param deferred
 */
function build (deferred) {
    vfs.src([
        paths.hbs.input + '/*.hbs',
        paths.hbs.input + '/_posts/*.md'
    ])
    .pipe(crossbow.stream({
        data: {
            pkg: 'file:../package.json'
        },
        config: {
            base: paths.hbs.input,
            defaultLayout: 'default.hbs',
            prettyUrls: true,
            layouts: {
                "type:post": 'post.hbs'
            }
        }
    }))
    .on('error', deferred.reject)
    .pipe(vfs.dest(paths.hbs.output))
    .on('end', deferred.resolve);
}

/**
 * Export the promise sequence
 * @type {Object|*}
 */
module.exports = builder;

/**
 * Handle CLI input
 */
if (!module.parent) {
    console.time('crossbow');
    builder().then(function () {
        console.timeEnd('crossbow');
    })
}