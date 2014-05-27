(function(global) {
//"use strict";

// --- dependency module -----------------------------------
//{@dev
//  This code block will be removed in `$ npm run build-release`. http://git.io/Minify
//var Valid = global["Valid"] || require("uupaa.valid.js"); // http://git.io/Valid
//}@dev

var fs      = require("fs");
var Process = require("child_process");

// --- local variable --------------------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- define ----------------------------------------------
// --- interface -------------------------------------------
function Plato(options,    // @arg Object: { verbose, title, output, files }
               callback) { // @arg Function(= null): callback(err):void
//{@dev
    _if(options.constructor !== ({}).constructor, Plato, "options");
    _if(!_keys(options, "verbose,title,output,files"), Plato, "options");
    if (callback) {
        _if(typeof callback !== "function", Plato, "callback");
    }
//}@dev

    _do(options, callback || null);
}

Plato["repository"] = "https://github.com/uupaa/Plato.js";

// --- implement -------------------------------------------
function _do(options, callback) {

    var command = "plato";

    if (options.title) {
        command += " --title " + options.title;
    }
    command += " --dir "   + options.output;
    command += " --jshint .jshintrc";
    command += " " + options.files.join(" ");

    if (options.verbose) {
        console.log("command: " + command);
    }
    Process.exec(command, function(err) {
        if (!err) {
            if (options.verbose) {
                console.log(command);
            }
            _parseHistoryJS();
            _parseHistoryJSON();
            _parseReportJS();
            _parseReportJSON();
        }
        if (options.callback) {
            callback(err);
        }
    });
}

// ---------------------------------------------------------
function _parseHistoryJS() {
    var fileName = "./lint/plato/report.history.js";

    if (fs.existsSync(fileName)) {
        _write(fileName, "__history = ", _load(fileName), "");
    }
}
function _parseHistoryJSON() {
    var fileName = "./lint/plato/report.history.json";

    if (fs.existsSync(fileName)) {
        _write(fileName, "", _load(fileName), "");
    }
}

function _parseReportJS() {
    var fileName = "./lint/plato/report.js";

    if (fs.existsSync(fileName)) {
        _write(fileName, "__report = ", _sort(_load(fileName)), "");
    }
}
function _parseReportJSON() {
    var fileName = "./lint/plato/report.json";

    if (fs.existsSync(fileName)) {
        _write(fileName, "", _sort(_load(fileName)), "");
    }
}

function _load(fileName) {
    if (/\.json$/.test(fileName)) {
        return JSON.parse( fs.readFileSync(fileName, "utf8") );
    } else if (/\.js$/.test(fileName)) {
        return eval("(" + fs.readFileSync(fileName, "utf8") + ")");
    }
    return fs.readFileSync(fileName, "utf8");
}

function _sort(json) {
    var result = {};
    var keys = Object.keys(json).sort();

    for (var i = 0, iz = keys.length; i < iz; ++i) {
        result[keys[i]] = json[keys[i]];
    }
    return result;
}

function _write(fileName, prefix, json, postfix) {
    fs.writeFileSync(fileName, prefix + JSON.stringify(json, null, 2) + postfix + "\n");
}

//{@dev
function _keys(value, keys) {
    var items = keys.split(",");

    return Object.keys(value).every(function(key) {
        return items.indexOf(key) >= 0;
    });
}

function _if(value, fn, hint) {
    if (value) {
        throw new Error(fn.name + " " + hint);
    }
}
//}@dev

// --- export ----------------------------------------------
if ("process" in global) {
    module["exports"] = Plato;
}
global["Plato" in global ? "Plato_" : "Plato"] = Plato; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

