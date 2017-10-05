"use strict";
const frame = require('ui/frame');

exports.onNavigatedTo = function(args) {
    global.endTime = performance.now();
    setTimeout(() => { frame.topmost().goBack(); });
};

