/*
    employee.js
        -- employee functions for route specific tasks and fetching data
        from the database

    Contributers
        -- Samuel Barnes
        -- Joe Jeffcock
        -- Artyom Tiunelis
        -- Diego Calanzone
*/


// Variable declarations
var db = require('./db.js');
var md5 = require('md5');
var moment = require('moment');


/*
 *  Function:   Create New Activity
 *  Input:      name, description, discount, cost, date, time, duration, sport id, facility id
 *  Output:     Bool / Error Message
*/
exports.newActivity = function(req_body){

    // Parameters
    let name = req_body.name;
    let description = req_body.description;
    let discount = req_body.discount;
    let cost = req_body.cost;
    let date = req_body.date;
    let time = req_body.time
    let start_time = date + " " + time;
    let duration = req_body.duration;
    let id_sport = req_body.id_sport;
    let id_facility = req_body.id_facility;

    if (discount == '') // If discount is empty, set to 0 (since field is integer)
        discount = 0;
    

    return new Promise(function(resolve, reject) {

        db.createActivity(name, description, discount, cost, start_time, duration, id_sport, id_facility).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Edit an existing activity
 *  Input:      name, description, discount, cost, date, time, duration, sport id, facility id
 *  Output:     Bool / Error Message
*/
exports.editActivity = function(req_body, activityId) {

    // Parameters
    let name = req_body.name;
    let description = req_body.description;
    let discount = req_body.discount;
    let cost = req_body.cost;
    let date = req_body.date;
    let time = req_body.time
    let start_time = date + " " + time;
    let duration = req_body.duration;
    let id_sport = req_body.id_sport;
    let id_facility = req_body.id_facility;

    if (discount == '') // If discount is empty, set to 0 (since field is integer)
        discount = 0;

    return new Promise(function(resolve, reject) {

        db.updateActivity(name, description, discount, cost, start_time, duration, id_sport, id_facility, activityId).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Create New Facility
 *  Input:      name, description, price, capacity, icon (name)
 *  Output:     Bool / Error Message
*/
exports.newFacility = function(req_body){

    // Parameters
    let name = req_body.name;
    let description = req_body.description;
    let price = req_body.price;
    let capacity = req_body.capacity;
    let icon = req_body.icon;

    return new Promise(function(resolve, reject) {

        db.createFacility(name, description, price, capacity, icon).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Edit an existing facility
 *  Input:      name, description, price, capacity, icon (name), Id of facility being edited
 *  Output:     Bool / Error Message
*/
exports.editFacility = function(req_body, facilityId) {
    // Parameters
    let name = req_body.name;
    let description = req_body.description;
    let price = req_body.price;
    let capacity = req_body.capacity;
    let icon = req_body.icon;

    return new Promise(function(resolve, reject) {

        db.updateFacility(name, description, price, capacity, icon, facilityId).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Create New Image
 *  Input:      image ext (extension)
 *  Output:     Bool / Error Message
*/
exports.newImage = function(ext){    

    return new Promise(function(resolve, reject) {

        db.newImage(ext).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Create New Activity Image
 *  Input:      Id of activity for new image, Id of image 
 *  Output:     Bool / Error Message
*/
exports.newActivityImage = function(activity_id, image_id){
    return new Promise(function(resolve, reject) {

        db.newActivityImage(activity_id, image_id).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Delete a specific activity image
 *  Input:      Id of activity to delete image from, Id of image to delete
 *  Output:     Bool / Error Message
*/
exports.deleteActivityImage = function(activity_id, image_id) {
    return new Promise(function( resolve, reject) {

        db.deleteActivityImage(activity_id, image_id).then(function(result) {

            // Result
            resolve(result);

        }).catch(function(err) {

            reject(err);
        });
    });
}


/*
 *  Function:   Get all images for a specified activity
 *  Input:      Id of activity to get images for
 *  Output:     Images (array) / Error Message
*/
exports.getActivityImages = function(activity_id) {
    return new Promise(function(resolve, reject) {

        db.getActivityImages(activity_id).then(function(result) {

            // Result
            resolve(result);

        }).catch(function(err) {

            reject(err);
        });
    });
}


/*
 *  Function:   Create New Facility Image
 *  Input:      Id of facility for new image, Id of image 
 *  Output:     Bool / Error Message
*/
exports.newFacilityImage = function(facility_id, image_id){
    return new Promise(function(resolve, reject) {

        db.newFacilityImage(facility_id, image_id).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });

    });
}


/*
 *  Function:   Delete a specific facility image
 *  Input:      Id of facility to delete image from, Id of image to delete
 *  Output:     Bool / Error Message
*/
exports.deleteFacilityImage = function(facility_id, image_id) {
    return new Promise(function( resolve, reject) {

        db.deleteFacilityImage(facility_id, image_id).then(function(result) {

            // Result
            resolve(result);

        }).catch(function(err) {

            reject(err);
        });
    });
}


/*
 *  Function:   Get all images for a specified facility
 *  Input:      Id of facility to get images for
 *  Output:     Images (array) / Error Message
*/
exports.getFacilityImages = function(facility_id) {
    return new Promise(function( resolve, reject) {

        db.getFacilityImages(facility_id).then(function(result) {

            // Result
            resolve(result);

        }).catch(function(err) {

            reject(err);
        });
    });
}


/*
 *  Function:   New Cash payment
 *  Input:      Id of activity to book, amount, user email, id of employee making payment
 *  Output:     Bool / Error Message
*/
exports.newCashPayment = function(req_body, employee_id){

    // Parameters
    let activity_id = req_body.activity_id;
    let amount = req_body.amount;
    let user_email = req_body.email;


    return new Promise(function(resolve, reject) {

        // get id by email
        db.getUserIdType(user_email).then(function(userObj) {
            db.createBooking(activity_id).then(function(result){
                db.createPaymentCash(amount, result[1][0].id, userObj.id, employee_id).then(function(result) {
    
                    // Result
                    resolve(result);

                // Error creating new cash payment
                }).catch(function(err) {
                    reject(err);
                });
    
            // Error creating new booking for activity
            }).catch(function(err){
                reject(err);
            });

        // Error get user id, type
        }).catch(function(err) {
            reject(err);
        });
    });
}


/*
 *  Function:   New Cash payment Receipt
 *  Input:      Id of payment to get receipt for
 *  Output:     Receipt details (attributes) / Error Message
*/
exports.getCashPaymentReceipt = function(payment_id){
    return new Promise(function(resolve, reject) {

        db.receiptPaymentCash(payment_id).then(function(result){
            
            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   get all employee payments by Id
 *  Input:      Id of employee to get payments for
 *  Output:     Payments (attributes) / Error Message
*/
exports.getEmployeePayments = function(employee_id) {
    return new Promise(function(resolve, reject) {
        db.getEmployeePayments(employee_id).then(function(result) {

            for (var i = 0; i < result.length; i++) {
                // Formatting date
                var mysql_date = result[i].purchase_date;

                let date = mysql_date.getTime();
                date = moment(date).format('DD/MM/YYYY hh:mm');
                
                result[i].purchase_date = date;
            }

            // Result
            resolve(result);

        }).catch(function(err) {

            reject(err);
        });
    })
}