"use strict";
if (typeof global.process === undefined) {
    global.process = {};
}
global.process.execArgv = "--allow-natives-syntax";

var v8 = require('v8-natives');

exports.runTests = function()
{
    console.log("Running", v8.isNative(), v8.getV8Version());
    var results = "";
    let functions=[Debugger];

    for (var i=0;i<functions.length;i++) {
        v8.helpers.testOptimization(functions[i]);
        results += v8.functionGetName(functions[i])+": " + optStatus(functions[i]) +"\r\n";
    }

    v8.helpers.testOptimization(addTest, add);
    results += "add: " + optStatus(add) +"\r\n";

    global.postMessage({info: results});
};

function optStatus(func) {
   const status = v8.getOptimizationStatus(func);
   switch (status) {
       case 1:
       case 3: return "Optimized"; break;
       case 7: return "Optimized"; break;  // TurboFan
       case 2:
       case 4: return "Un-optimized"; break;
       case 6: return "Unknown"; break;

       default: return status;
   }
}

function Debugger() {
    var test="hi";
    if (false) {
        debugger;
    }
}

// Not testing this function
function addTest() {
    add(10, 20);
    add("testing ", "this");
}

function add(x, y) {
    return x + y;
}

