"use strict";
var builder = require('ui/builder');

exports.runTests = function() {
    global.gc();
    java.lang.System.gc();

    var time1 = performance.now();
    parse1();
    var time2 = performance.now();
    var t1 = time2-time1;
    global.gc();
    java.lang.System.gc();

    var time3 = performance.now();
    parse2();
    var time4 = performance.now();
    var t2 = time4-time3;
    global.gc();
    java.lang.System.gc();

    global.postMessage({results: [t1,t2], name: 'parse'});
};

function parse1() {
    var d=[];
    for (var i=0;i<10000;i++) {
        var module = {};
        var elements = builder.load("clean.xml", module);
        d.push(elements);
    }
}

function parse2() {
    var d=[];
    for (var i=0;i<10000;i++) {
        var module = {};
        var elements = builder.load("dirty.xml", module);
        d.push(elements);
    }
}