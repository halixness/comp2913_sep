/*
    facility.js
        -- functions for getting data about facilities, activities, sports
        and the pricing of each (including memberships)

    Contributers
        -- Samuel Barnes
        -- Joe Jeffcock
        -- Artyom Tiunelis
        -- Diego Calanzone
*/


// Variable declarations 
var db = require('./db.js');


/*
 *  Function:   Get Facility Activities
 *  Input:      Id of facility to get facilities for
 *  Output:     Error Message / activities (array of objects)
*/
exports.getFacilityActivities = function(id){

    return new Promise(function(resolve, reject) {

        db.getFacilityActivities(id).then(function(results){

            // Result
            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Get All Activities
 *  Output:     Error Message / activities (array of objects)
*/
exports.getAllActivities = function(){

    return new Promise(function(resolve, reject) {

        db.getAllActivities().then(function(results){

            // Result
            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}


/*
 *  Function:   Get All Facilities
 *  Output:     Error Message / facilities (array of objects)
*/
exports.getAllFacilities = function(){

    return new Promise(function(resolve, reject) {

        db.getAllFacilities().then(function(results){

            // Result
            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}


/*
 *  Function:   Get All Sports
 *  Output:     Error Message / sports (array of objects)
*/
exports.getAllSports = function(){

    return new Promise(function(resolve, reject) {

        db.getAllSports().then(function(results){

            // Result
            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}


/*
 *  Function:   Get Monthly Pricing
 *  Input:      Type:int
 *  Output:     Error Message / pricing obj
*/
exports.getMonthlyPricing = function(){

    return new Promise(function(resolve, reject) {

        db.getPricingByType(1).then(function(results){

            // Result
            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}


/*
 *  Function:   Get Yearly Pricing
 *  Input:      Type:int
 *  Output:     Error Message / pricing obj
*/
exports.getYearlyPricing = function(){

    return new Promise(function(resolve, reject) {

        db.getPricingByType(2).then(function(results){

            // Result
            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}


/*
 *  Function:   Get Sports Pass
 *  Input:      Type:int
 *  Output:     Error Message / pricing obj
*/
exports.getSportsPassPricing = function(){

    return new Promise(function(resolve, reject) {

        db.getPricingByType(3).then(function(results){

            // Result
            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}


/*
 *  Function:   Get All Pricings
 *  Input:      Id of sport to get pricing for
 *  Output:     Error Message / pricing obj
*/
exports.getPricingBySport = function(sportId){

    return new Promise(function(resolve, reject) {

        db.getPricingBySport(sportId).then(function(results){

            // Result
            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}


/*
 *  Function:   Get pricing by membership type (monthly, annual, sports pass) ; (1, 2, 3)
 *  Input:      type of membership to get pricing for
 *  Output:     Error Message / pricing obj
*/
exports.getPricingByType = function(type) {
    return new Promise(function(resolve, reject) {

        db.getPricingByType(type).then(function(results) {

            // Result
            resolve(results);

        }).catch(function(err) {

            reject(err);

        });

    });
}   


/*
 *  Function:   Get pricing amount by payment id
 *  Input:      Id of payment to get pricing for
 *  Output:     Error Message / int: pricing amount
*/
exports.getPricingAmount = function(paymentId) {
    return new Promise(function(resolve, reject) {
        db.getPricingAmount(paymentId).then(function(result) {

            // Result
            resolve(result);

        }).catch(function(err) {
            reject(err)
        });
    });
}
