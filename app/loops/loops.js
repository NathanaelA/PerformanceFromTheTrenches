"use strict";

exports.runTests = function() {
    global.gc();
    java.lang.System.gc();
    var time1 = performance.now();
    loops1();
    var time2 = performance.now();
    var t1 = time2-time1;

    global.gc();
    java.lang.System.gc();
    var time3 = performance.now();
    loops2();
    var time4 = performance.now();
    var t2 = time4-time3;
    global.gc();
    java.lang.System.gc();

    global.postMessage({results: [t1, t2], name: 'loops'});
};

function doSomething(callback) {
    callback();
}

// Optimized
function loops1() {
    var val = 0, fun = function() {
        val++;
    };
    for (var i=0;i<100000;i++) {
        doSomething(fun);
    }
}


// Unoptimized
function loops2 () {
    var val = 0;
    for (var i=0;i<100000;i++) {
        doSomething(() => { val++; });
    }
}