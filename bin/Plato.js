// @name: bin/Plato.js
// @require: Plato.js, fs

(function(global) {

var _USAGE = '\n'+
'   Usage:\n' +
'       node bin/Plato.js [--help]\n' +
'                         [--verbose]\n' +
'                         [--title page-title]\n' +
'                         [--output output-dir]\n' +
'                         input-file [input-file ...]\n' +
'\n'+
'   See:\n'+
'       https://github.com/uupaa/Plato.js/wiki/Plato\n';

var _CONSOLE_COLOR = {
        RED:    "\u001b[31m",
        YELLOW: "\u001b[33m",
        GREEN:  "\u001b[32m",
        CLEAR:  "\u001b[0m"
    };

var Plato   = require("../lib/Plato");
var fs      = require("fs");
var argv    = process.argv.slice(2);
var io      = _loadCurrentDirectoryPackageJSON();
var options = _parseCommandLineOptions({
        help:       false,          // Boolean: true is show help.
        verbose:    false,          // Boolean: true is verbose mode.
        title:      io.title,       // String: title.
        output:     "./lint/plato", // String: output dir.
        inputs:     io.inputs       // StringArray: input files. [file, ...]
    });

if (options.help) {
    console.log(_CONSOLE_COLOR.YELLOW + _USAGE + _CONSOLE_COLOR.CLEAR);
    return;
}
if (!options.inputs.length) {
    console.log(_CONSOLE_COLOR.RED + "Input files are empty." + _CONSOLE_COLOR.CLEAR);
    return;
}

Plato({
    "verbose":      options.verbose,
    "title":        options.title,
    "output":       options.output,
    "inputs":       options.inputs
}, function() { });

function _loadCurrentDirectoryPackageJSON() {
    var path   = "./package.json";
    var json   = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, "utf8")) : {};
    var build  = json["x-build"] || json["build"] || {};
    var inputs = build.inputs || [];
    var output = build.output || "";
    var title  = json.name || "";

    return { inputs: inputs, output: output, title: title };
}

function _parseCommandLineOptions(options) {
    for (var i = 0, iz = argv.length; i < iz; ++i) {
        switch (argv[i]) {
        case "-h":
        case "--help":      options.help = true; break;
        case "-v":
        case "--verbose":   options.verbose = true; break;
        case "--title":     options.title = argv[++i]; break;
        case "--output":    options.output = argv[++i]; break;
        default:
            var file = argv[i];
            if (options.inputs.indexOf(file) < 0) { // avoid duplicate
                options.inputs.push(file);
            }
        }
    }
    return options;
}

})((this || 0).self || global);

