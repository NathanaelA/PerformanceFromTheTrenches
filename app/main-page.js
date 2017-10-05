"use strict";
const animation = require('ui/animation');
const worker = new Worker('./workerHandler.js');
const frame = require('ui/frame');
const sqlite = require('nativescript-sqlite');

var animationSet=null;

global.inTimer=false;
global.runPage = '';
global.runPageCount = 0;
global.startTime = 0;
global.endTime = 0;
global.totalTime = 0;
global.firstTime = 0;


function onNavigatingTo(args) {
    if (!global.inTimer) {
        let page = args.object;
        setTimeout(function () {
            startAnimation(page);
        });
    }
}
exports.onNavigatingTo = onNavigatingTo;

exports.onNavigatedTo = function(page) {
   if (global.inTimer) {
       global.runPageCount++;
       let time = global.endTime-global.startTime;
       console.log(global.runPage, time);
       if (global.runPageCount !== 1 && global.runPageCount !== 11) {
           global.totalTime += time;
       }
       if (global.runPageCount === 5) {
           global.firstTime = global.totalTime;
           global.totalTime = 0;
           if (this.runPage === "./layoutStack") {
               this.runPage = "./layoutGrid";
           }
       }
       if (global.runPageCount === 10) {
           handleMessage({data: {results: [global.totalTime,global.firstTime], name: global.runPage}});
           global.inTimer = false;
           return;
       }
       gc();
       setTimeout(() => {
           global.startTime = performance.now();
           frame.topmost().navigate(global.runPage);
       });
   }
};

exports.onNavigatingFrom = function() {
    stopAnimation();
};

function stopAnimation() {
    if (animationSet) {
        animationSet.cancel();
        animationSet = null;
    }
}

function startAnimation(page) {
    var view;

    if (!page) {
        view = getElementById('ns');
    } else {
        view = page.getElementById('ns');
    }
    animationSet = new animation.Animation([{
        target: view,
        rotate: 360,
        duration: 2000,
        iterations: Number.POSITIVE_INFINITY,
        curve: global.android ? new android.view.animation.LinearInterpolator : UIViewAnimationCurve.UIViewAnimationCurveLinear
}]);
    animationSet.play().catch(function (e) {
        console.log("Animation stopped!");
    });
}

exports.stackTest = function() {
    global.inTimer = true;
    global.runPageCount = 0;
    global.runPage = "./layoutStack/layout";
    global.totalTime = 0;
    stopAnimation();
    global.startTime = performance.now();
    frame.topmost().navigate(global.runPage);
};

exports.showLayout = function() {
    frame.topmost().navigate("./layout/layout");
};

exports.parseTest = function() {
    runTests("./xmlSizeOne/parse");
};

exports.parseLoops = function() {
    runTests("./loops/loops");
};

exports.sqliteTest = function() {
    runTests("./sqlite/sqlite");
};

exports.OptimizationTests = function() {
    runTests("./optimization/optimization");
};

exports.arrayTest = function() {
    runTests("./array/array");
};


worker.onmessage = function(msg) {
    handleMessage(msg);
};

worker.onerror = function(err) {
    console.dir(err);
};

function handleMessage(msg) {
    const d = getElementById("results");

    var line;
    if (typeof msg.data.info ==='undefined') {

        var time1 = msg.data.results[0];
        var time2 = msg.data.results[1];

        line = msg.data.name + ": \nGood: " + Number(time1).toFixed(2) + "\nBad: " + Number(time2).toFixed(2);
    } else {
        line = msg.data.info;
    }
    d.text = line;
}

function runTests(tests) {
    const d = getElementById('switch');
    if (d.checked) {
        worker.postMessage({require:tests});
    } else {
        if (typeof global.postMessage !== 'function') {
            global.postMessage = function(msg) {
                handleMessage({data: msg});
            };
        }
        let req = require(tests);
        req.runTests();
    }

}

function objectTest() {


}

var MyClass = (function () {
function myClass() {
    this._hi = "Hello";
}

myClass.prototype.nativeScript = function() {
    this._nativeScript = "NativeScript";
};
    return myClass;
}());
