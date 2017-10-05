/**********************************************************************************
 * (c) 2017, Nathanael Anderson.
 * Licensed under the MIT license.
 *
 * Version 1.0.0                                        nathan@master-technology.com
 **********************************************************************************/
'use strict';
/* global global, require */
require('globals');


global.onmessage = function(msg) {
    var req = require(msg.data.require);
    req.runTests();
};