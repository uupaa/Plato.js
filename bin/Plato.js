(function(global) {

var _USAGE = _multiline(function() {/*
    Usage:
        node bin/Plato.js [--help]
                          [--verbose]
                          [--title page-title]
                          [--output output-dir]
                          input-file [input-file ...]

    See:
        https://github.com/uupaa/Plato.js/wiki/Plato
*/});

var _CONSOLE_COLOR = {
        RED:    "\u001b[31m",
        YELLOW: "\u001b[33m",
        GREEN:  "\u001b[32m",
        CLEAR:  "\u001b[0m"
    };

var Plato   = require("../lib/Plato");
var fs      = require("fs");
var argv    = process.argv.slice(2);
var package = _loadCurrentDirectoryPackageJSON();
var options = _parseCommandLineOptions({
        help:       false,          // Boolean: true is show help.
        verbose:    false,          // Boolean: true is verbose mode.
        title:      package.title,  // String: title.
        output:     "./lint/plato", // String: output dir.
        files:      package.files   // StringArray: input files. [file, ...]
    });

if (options.help) {
    console.log(_CONSOLE_COLOR.YELLOW + _USAGE + _CONSOLE_COLOR.CLEAR);
    return;
}
if (!options.files.length) {
    console.log(_CONSOLE_COLOR.RED + "Input files are empty." + _CONSOLE_COLOR.CLEAR);
    return;
}

Plato({
    "verbose":      options.verbose,
    "title":        options.title,
    "output":       options.output,
    "files":        options.files
}, function() { });

function _loadCurrentDirectoryPackageJSON() {
    var path   = "./package.json";
    var json   = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, "utf8")) : {};
    var build  = json["x-build"] || json["build"] || {};
    var files  = build["source"] || build["files"] || build["inputs"] || []; // inputs was deprecated.
    var output = build["output"] || "";
    var title  = json.name || "";

    return { files: files, output: output, title: title };
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
            if (options.files.indexOf(file) < 0) { // avoid duplicate
                options.files.push(file);
            }
        }
    }
    return options;
}

function _multiline(fn) { // @arg Function:
                          // @ret String:
    return (fn + "").split("\n").slice(1, -1).join("\n");
}

})((this || 0).self || global);

