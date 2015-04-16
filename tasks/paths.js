var fs = require('fs');

/**
 * Define your paths here
 * @type {object}
 */
var paths = {
    sass: {
        input:  'scss/main.scss',
        output: 'css/main.min.css'
    },
    hbs: {
        input:   'src',
        output:  '.'
    }
};

/**
 * @param key
 * @param type
 * @param output
 */
function write (key, type, output) {
    fs.writeFileSync(make(key, type), output);
}

/**
 * @param key
 * @param type
 * @returns {String|*}
 */
function make (key, type) {
    var path = require('path');
    return path.resolve(__dirname, '../', paths[key][type]);
}

module.exports       = paths;
module.exports.make  = make;
module.exports.write = write;
module.exports.root  = process.cwd();