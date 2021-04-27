/*
    report.js
        -- statistics functions for reporting user, activity, memberships and payment data
        to the admins

    Contributers
        -- Diego Calanzone
*/


// Variable declarations
var db = require('./db.js');
var moment = require('moment');


/*
 *  Function:   Login Activity
 *  Output:     Error Message
*/
exports.getLoginActivity = function(start, end){

    return new Promise(function(resolve, reject) {

        // Preprocess date (boring!)
        start = moment(start, 'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss');
        end = moment(end, 'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss');

        db.getUserLoginActivity(start, end).then(function(results){

            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Login Activity
 *  Output:     Error Message
*/
exports.getRegistrationActivity = function(){

    return new Promise(function(resolve, reject) {

        db.getUserRegistrationActivity().then(function(results){

            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Get Overall Activity Usage
 *  Output:     Error Message
*/
exports.getOverallActivityUsage = function(id){

    return new Promise(function(resolve, reject) {

        db.getOverallActivityUsage(id).then(function(results){

            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Get Weekly Activity Usage
 *  Output:     Error Message
*/
exports.getWeeklyActivityUsage = function(id, start, end){

    return new Promise(function(resolve, reject) {

        // Preprocess date (boring!)
        start = moment(start, 'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss');
        end = moment(end, 'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss');

        // Query
        db.getWeeklyActivityUsage(id, start, end).then(function(results){

            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Get Overall Facility Usage
 *  Output:     Error Message
*/
exports.getOverallFacilityUsage = function(id){

    return new Promise(function(resolve, reject) {

        db.getOverallFacilityUsage(id).then(function(results){

            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Get Weekly Facility Usage
 *  Output:     Error Message
*/
exports.getWeeklyFacilityUsage = function(id, start, end){

    return new Promise(function(resolve, reject) {

        // Preprocess date (boring!)
        start = moment(start, 'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss');
        end = moment(end, 'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss');

        // Query
        db.getWeeklyFacilityUsage(id, start, end).then(function(results){

            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Get Overall Sport Usage
 *  Output:     Error Message
*/
exports.getOverallSportUsage = function(id){

    return new Promise(function(resolve, reject) {

        db.getOverallSportUsage(id).then(function(results){

            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Get Weekly Sport Usage
 *  Output:     Error Message
*/
exports.getWeeklySportUsage = function(id, start, end){

    return new Promise(function(resolve, reject) {

        // Preprocess date (boring!)
        start = moment(start, 'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss');
        end = moment(end, 'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss');

        // Query
        db.getWeeklySportUsage(id, start, end).then(function(results){

            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}