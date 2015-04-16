var sass     = require('node-sass');
var path     = require('path');
var fs       = require('fs');
var paths    = require('./paths');
var CleanCSS = require('clean-css');
var prom     = require('prom-seq');

/**
 * Define the tasks that make up a build
 * @type {Object}
 */
var builder  = prom.create([processSass, minifyCss, writeFile]);

/**
 * Process SASS
 * @param deferred
 * @param previous
 */
function processSass (deferred, previous) {
    var out = sass.renderSync({
        file: paths.make('sass', 'input')
    });
    deferred.resolve(out.css);
}

/**
 * Minify CSS output
 * @param deferred
 * @param previous
 */
function minifyCss (deferred, previous) {

    var minified = new CleanCSS({
        relativeTo: __dirname
    }).minify(previous.toString()).styles;

    deferred.resolve(minified);
}

/**
 * @param deferred
 * @param previous
 */
function writeFile (deferred, previous) {
    try {
        paths.write('sass', 'output', previous);
        deferred.resolve();
    } catch (e) {
        deferred.reject();
    }
}

if (!module.parent) {
    builder()
        .catch(function (err) {
            console.error(err);
        });
}

module.exports = builder;

