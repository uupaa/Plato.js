// @name: Plato.js
// @require: Valid.js, fs, child_process

(function(global) {
//"use strict";

// --- variable --------------------------------------------
//{@assert
var Valid = global["Valid"] || require("uupaa.valid.js");
//}@assert
var fs      = require("fs");
var Process = require("child_process");

var _inNode = "process" in global;

// --- define ----------------------------------------------
// --- interface -------------------------------------------
function Plato(options,    // @arg Object: { verbose, title, output, inputs }
               callback) { // @arg Function(= null): callback(err):void
                           // @help: Plato
//{@assert
    _if(!Valid.type(options,  "Object", "verbose,title,output,inputs"), "Plato(options)");
    _if(!Valid.type(callback, "Function/omit"),                         "Plato(,callback)");
//}@assert

    _do(options, callback || null);
}

Plato["name"] = "Plato";
Plato["repository"] = "https://github.com/uupaa/Plato.js";

// --- implement -------------------------------------------
function _do(options, callback) {

    var command = "plato";

    if (options.title) {
        command += " --title " + options.title;
    }
    command += " --dir "   + options.output;
    command += " --jshint .jshintrc";
    command += " " + options.inputs.join(" ");

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

//{@assert
function _if(value, msg) {
    if (value) {
        console.error(Valid.stack(msg));
        throw new Error(msg);
    }
}
//}@assert

// --- export ----------------------------------------------
//{@node
if (_inNode) {
    module["exports"] = Plato;
}
//}@node
if (global["Plato"]) {
    global["Plato_"] = Plato; // already exsists
} else {
    global["Plato"]  = Plato;
}

})((this || 0).self || global);

