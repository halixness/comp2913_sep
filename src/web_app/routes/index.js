/*
    index.js
        -- Routes for when the user is not logged in; i.e everthing
        the user can do without creating an account
        
    Contributers
        -- Samuel Barnes
        -- Joe Jeffcock
        -- Artyom Tiunelis
        -- Diego Calanzone
*/


// Variable declarations
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('client-sessions');
var facility = require('../modules/facility');
var error = require('../modules/error');
const url = require('url');

var csrf = csurf({ cookie: true });

// Session
router.use(session({
    cookieName: 'session',
    secret: 'yellowpuddingcoronapspreading',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));


// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Website header
const webname = ' The Edgy ';


/*
 *  Function:   Homepage Router
*/
router.get(['/', '/home'], csrf, function(req, res) {

    // Render
    res.render(path.join(__dirname + '/../views/pages/index.ejs'),
    {
        title: webname + "| Home",
        session: req.session
    });
});


/*
 *  Function:   Get smallest price
 *  Input:      array: prices
 *  Output:     smallest price from array
*/
var getSmallestPrice = function(prices) {
    var smallest = prices[0];
    
    // Calculate smallest
    for (var i = 0; i < prices.length; i++) {
        if (prices[i].amount < smallest.amount) {
            smallest.amount = prices[i].amount;
        }
    }

    return smallest;
}


/*
 *  Function:   Memberships Page Router
*/
router.get('/memberships', csrf, function(req, res) {

    var queries = [
        facility.getMonthlyPricing(),
        facility.getYearlyPricing(),
        facility.getSportsPassPricing()
    ];

    // Gather all the pricings
    Promise.all(queries).then(results => { 

        // Parse data
        var startMonthlyPricing = getSmallestPrice(results[0]);
        var startYearlyPricing = getSmallestPrice(results[1]);
        var passPricing = getSmallestPrice(results[2]);

        // Render page
        res.render(path.join(__dirname + '/../views/pages/memberships.ejs'),
        {
            title: webname + "| Memberships",
            session: req.session,
            pricing: [startMonthlyPricing, startYearlyPricing, passPricing],
        });

    // Catch errors
    }).catch(function(err){

        error.defaultError(req, res, webname, err);
    });
});


/*
 *  Function:   Facilities Page Router GET
 *  Input:      No. items, page No.
*/
router.get('/facilities', csrf, function(req, res) {

    var no_items = 6;
    var page_no = 1;

    user.facilities(no_items, page_no).then(function (results) {

        // Render page
        res.render(path.join(__dirname + '/../views/pages/facilities.ejs'),
        {
            no_items: no_items,
            page_no: page_no,
            no_pages: Math.ceil(results[0][0].count/no_items),
            total: results[0][0].count,
            results: results[1],
            title: webname + "| Facilities",
            session: req.session,
            csrfToken: req.csrfToken()
        });

    // Error getting facilities
    }).catch(function(err){
        
        error.defaultError(req, res, webname, err);
    });

});


/*
 *  Function:   Facilities Page Router POST
 *  Input:      No. items, page No.
*/
router.post('/facilities', csrf, function(req, res) {

    var no_items = parseInt(req.body.no_items);
    var page_no = parseInt(req.body.page_no);

    user.facilities(no_items, page_no).then(function (results) {

        // Render
        res.render(path.join(__dirname + '/../views/pages/facilities.ejs'),
        {
            no_items: no_items,
            page_no: page_no,
            no_pages: Math.ceil(results[0][0].count/no_items),
            total: results[0][0].count,
            results: results[1],
            title: webname + "| Facilities",
            session: req.session,
            csrfToken: req.csrfToken()
        });

    // Error getting facilities
    }).catch(function(err){
        
        error.defaultError(req, res, webname, err);
    });
});


/*
 *  Function:   Facilities Page Router
 *  Input:      Id of facility to render
*/
router.get('/facilities/discover', csrf, function(req, res) {

    var facilityId = parseInt(req.query.id);
    var errors = [];
    var currentDate = new Date();

    var week = new Array(); 
    currentDate.setDate((currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() == 0 ? -6 : 1)));
    for (var i = 0; i < 7; i++) {
        week.push(new Date(currentDate).toDateString()); 
        currentDate.setDate(currentDate.getDate() +1);
    }
   
    var currentDate = new Date();
    var today = (currentDate.getDay() + (currentDate.getDay() == 0 ? 6 : -1));

    errors = [];

    if (req.query.full) {
        user.getActivity(req.query.full).then(function(fullActivity) {
            if (fullActivity.booked_capacity >= fullActivity.capacity) errors = [{
                    message: "Activity already fully booked!",
                    path: 'unsuccessful',
                    id: req.query.full
                }];
            
        // Error getting activity, do nothing because it means incorrect params in url so we just dont show any error
        }).catch(function(err) {
            errors = [];
        });
    }

    if (req.query.admin && req.session.userType == 3) errors = [{
            message: "Admins cannot book activities",
            path: 'unsuccessful',
            id: req.query.admin
        }];

    user.facilities_discover(facilityId).then(function(results) {

        if (results[0].length < 1) 
            // Throw 404 if no facility under id 
            res.status(404).render(path.join(__dirname + '/../views/pages/error-404.ejs'), {
                title: "Page not found",
                session: req.session
            });

        else {
            user.facilities_timetable(facilityId, currentDate).then(function(timetable) {

                // Render
                res.render(path.join(__dirname + '/../views/pages/facilities_discover.ejs'),
                {
                    facility: results[0],
                    images: results[1],
                    title: webname + "| Facilities",
                    session: req.session,
                    csrfToken: req.csrfToken(),
                    week: week,
                    today: today,
                    timetable: timetable,
                    error: errors
                });

            // Error getting timetable activities
            }).catch(function(err) {
                
                error.defaultError(req, res, webname, err);
            });
        }

    // Error getting facility details + images
    }).catch(function(err){
        
        error.defaultError(req, res, webname, err);
    });
});


/*
 *  Function:   Login Page Router GET
*/
router.get('/user/login', csrf, function(req, res) {

    // Check logged user
    if(req.session.userId != undefined)
        res.redirect('/user/account');

    else {

        from = req.header('Referer') || '/';

        if (req.session.from != undefined) {
            if (req.session.from.includes("membership") && url.parse(from, true).pathname != '/memberships') 
                req.session.destroy();

            else if (req.session.from.includes("booking") && url.parse(from, true).pathname != '/activities')
                req.session.destroy();
        }

        // Otherwise render login page
        res.render(path.join(__dirname + '/../views/pages/login.ejs'),
        {
            title: webname + "| Login",
            form: req.body,
            csrfToken: req.csrfToken()
        });
    }
});


/*
 *  Function:   Activities page
 *  Input:      No. items, page No., filters (attributes)
*/
router.get('/activities', csrf, function(req, res) {
    var currentDate = new Date();

    // default values
    var no_items = 7;
    var page_no = 1;
    var filters = {};
    filters['start_date'] = currentDate.getFullYear() + '-' +
                            currentDate.getMonth() + '-' +
                            currentDate.getDate() + ' ' +
                            currentDate.getHours() + ':' +
                            currentDate.getMinutes() + ':' +
                            currentDate.getSeconds();
    
    // passed as parameters
    if (req.query.no_items && req.query.page_no) {
        no_items = parseInt(req.query.no_items);
        page_no = parseInt(req.query.page_no);
    }
    if (req.query.sport)
        filters['sport'] = req.query.sport;
    if (req.query.facility)
        filters['facility'] = req.query.facility;
    if (req.query.start_date)
        filters['start_date'] = req.query.start_date;
    if (req.query.end_date)
        filters['end_date'] = req.query.end_date;

    errors = [];

    if (req.query.full) {
        user.getActivity(req.query.full).then(function(fullActivity) {
            if (fullActivity.booked_capacity >= fullActivity.capacity) errors = [{
                    message: "Activity already fully booked!",
                    path: 'unsuccessful',
                    id: req.query.full
                }];
            
        // Error getting activity, do nothing because it means incorrect params in url so we just dont show any error
        }).catch(function(err) {
            errors = [];
        });
    }

    if (req.query.admin && req.session.userType == 3) errors = [{
            message: "Admins cannot book activities",
            path: 'unsuccessful',
            id: req.query.admin
        }];
    

    var week = new Array(); 
    currentDate.setDate((currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() == 0 ? -6 : 1)));
    for (var i = 0; i < 7; i++) {
        week.push(new Date(currentDate).toDateString()); 
        currentDate.setDate(currentDate.getDate() +1);
    }
   
    var currentDate = new Date();
    var today = (currentDate.getDay() + (currentDate.getDay() == 0 ? 6 : -1));

    user.upcomingActivities(no_items, page_no, filters).then(function(results) {
        user.activitiesTimetable(currentDate).then(function(timetable) {
            facility.getAllSports().then(function(sports) {
                facility.getAllFacilities().then(function(facilities) {

                    // Render
                    res.render(path.join(__dirname + '/../views/pages/activities.ejs'),
                    {
                        no_items: no_items,
                        page_no: page_no,
                        no_pages: Math.ceil(results[0][0].count/no_items),
                        total: results[0][0].count,
                        filters: filters,
                        results: results[1],
                        title: webname + "| Activities",
                        session: req.session,
                        csrfToken: req.csrfToken(),
                        week: week,
                        today: today,
                        timetable: timetable,
                        sports: sports,
                        facilities: facilities,
                        error: errors
                    });
                
                // Error getting all facilities
                }).catch(function(err) {
                    
                    error.defaultError(req, res, webname, err);
                });
                
            // Error getting all sports
            }).catch(function(err) {
                
                error.defaultError(req, res, webname, err);
            });
        
        // Error getting activities timetable
        }).catch(function(err) {
            
            error.defaultError(req, res, webname, err);
        }); 

    // Error getting upcoming activities 
    }).catch(function(err){
        
        error.defaultError(req, res, webname, err);
    });
});


/*
 *  Function:   Facilities Page Router POST
 *  Input:      No. items, page No.
*/
router.post('/activities', csrf, function(req, res) {

    var no_items = parseInt(req.body.no_items);
    var page_no = parseInt(req.body.page_no);

    user.upcomingActivities(no_items, page_no).then(function (results) {

        // Render
        res.render(path.join(__dirname + '/../views/pages/activities.ejs'),
        {
            no_items: no_items,
            page_no: page_no,
            no_pages: Math.ceil(results[0][0].count/no_items),
            total: results[0][0].count,
            results: results[1],
            title: webname + "| Activities",
            session: req.session,
            csrfToken: req.csrfToken()
        });

    // Error getting upcoming activities 
    }).catch(function(err){
        
        error.defaultError(req, res, webname, err);
    });
});


// Exports
module.exports = router;