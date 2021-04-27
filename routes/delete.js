/*
    delete.js
        -- Routes to facilitate deleting records from the database,
        or deleteing objects

    To do:
        -- add comment headers to all functions *
        -- replce console.log in err with default error

    Contributers
        -- Samuel Barnes
*/


// Variable declarations
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');
var error = require('../modules/error.js');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const validation = require('../modules/validation');

var urlEncoded = bodyParser.urlencoded({ extended: true });
var jsonEncoded = bodyParser.json();

// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));

// Website header
const webname = ' The Edgy ';


/*
 *  Function:   Delete facility by id
 *  Input:      Id of facility to delete
 *  Output:     Error message / bool
*/
router.get('/facility/:id*', function(req, res, next) {
    if(req.session.userId != undefined && req.session.userType == 3) {
       
        user.deleteFacility(req.params['id']).then(function() {

            // Success
            res.redirect('/manager/facilities/new');

        }).catch(function(err) {

            error.defaultError(req, res, webname, err);
        });
    }
}); 


/*
 *  Function:   Delete activity by id
 *  Input:      Id of activity to delete
 *  Output:     Error message / Bool
*/
router.get('/activity/:id*', function(req, res, next) {
    console.log(req.params['id']);

    user.deleteActivity(req.params['id']).then(function() {

        // success
        res.redirect('/manager/activities/new');

    }).catch(function(err) {

        error.defaultError(req, res, webname, err);
    });
}); 


/*
 *  Function:   Delete Membership by id
 *  Input:      Id of membership to delete
 *  Output:     Error message / Bool
*/
router.get('/memberships/:id*', function(req, res, next) {
    
    if(req.session.userId != undefined){

        user.cancelMembership(req.session.userId, req.params['id']).then(function(){

            // Success, redirect
            res.redirect('/user/account/memberships');

        // Error page
        }).catch(function(err){

            error.defaultError(req, res, webname, err);
        });
    }
});


/*
 *  Function:   Delete Booking by id
 *  Input:      Id of booking to delete (cancel)
 *  Output:     Error message / Bool
*/
router.get('/booking/:id*', function(req, res) {

    // Session Check
    if (req.session.userId == undefined)
       res.redirect('/home');

   // Success
    else {

        user.cancelBooking(req.params['id']).then(function() {

            // Success
            res.redirect('/user/account/bookings');

        }).catch(function(err) {
            
            error.defaultError(req, res, webname, err);
        });
    }
});


/*
 *  Function:   Delete Card by id
 *  Input:      Id of card to delete
 *  Output:     Error message / Bool
*/
router.get('/cards/:id*', function(req, res, next) {
    
    if(req.session.userId != undefined){

        user.deleteCard(req.session.userId, req.params['id']).then(function(){

            // Success, redirect
            res.redirect('/user/account/payment');

        // Error page
        }).catch(function(err){

            error.defaultError(req, res, webname, err);
        });
    }
});


// Exports
module.exports = router;