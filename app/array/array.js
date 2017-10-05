"use strict";

exports.runTests = function() {
    global.gc();
    java.lang.System.gc();
    var time1 = performance.now();
    array1();
    var time2 = performance.now();
    var t1 = time2-time1;

    global.gc();
    java.lang.System.gc();
    var time3 = performance.now();
    array2();
    var time4 = performance.now();
    var t2 = time4-time3;
    global.gc();
    java.lang.System.gc();

    global.postMessage({results: [t1, t2], name: 'array'});
};

// Optimized
function array1() {
    var arr=[];
    for (var i=0;i<10000;i++) {
        arr.push(i);
    }
    var cnt = 0;
    for (var i=0;i<10000;i++) {
        cnt += arr[i];
    }
    return cnt;
}

// Unoptimized
function array2 () {
    var arr=new Array(10000);
    for (var i=0;i<10000;i++) {
        arr[i] = i;
    }
    var cnt = 0;
    for (var i=0;i<10000;i++) {
        cnt += arr[i];
    }
    return cnt;
}