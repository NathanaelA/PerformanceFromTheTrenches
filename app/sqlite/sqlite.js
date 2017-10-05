"use strict";
const sqlite = require('nativescript-sqlite');
const fs = require('file-system');

var dbname = 'name_db.sqlite';
var db = null;

exports.runTests = function() {

    var fileUrl = fs.path.join(fs.knownFolders.currentApp().path, dbname);
    console.log(fileUrl);

    new sqlite(fileUrl, function (err, dbConnection) {
        if (err) {
            console.log(err);
        }

        db = dbConnection;
      /*  for (var i=0;i<1000;i++) {
            db.execSQL("insert into names (name) values (?)", "testing");
        } */

        db.resultType(sqlite.RESULTSASOBJECT);
        var time1 = performance.now();
        reloadData(() => {
            var time2 = performance.now();
            var t1 = time2 - time1;
            global.postMessage({info: "Sqlite: "+parseInt(t1,10)});
        });
    });
};

// Optimized
function reloadData(callback) {
    db.resultType(sqlite.RESULTSASOBJECT);
    db.valueType(sqlite.VALUESARENATIVE);

    db.all('select name from names', function (err, loadedData) {
        if (err) {
            console.log(err);
        } else {
            callback();
        }
    });
}
