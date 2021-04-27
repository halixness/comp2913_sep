/*
    error.js
        -- error pages for specific routes to render error messages to front end

    Contributers
        -- Samuel Barnes
        -- Joe Jeffcock
        -- Artyom Tiunelis
        -- Diego Calanzone
*/


// Variable declaration
var path = require('path');
var moment = require('moment');
const webname = ' The Edgy ';


/*
 *  Function:   Renders login page with errors
*/
exports.loginErrorPage = function(req, res, webname, err){

    // Render with error
    res.render(path.join(__dirname + '/../views/pages/login.ejs'),
    {
        title: webname + "| Login",
        error: err,
        form: req.body,
        csrfToken: req.csrfToken()
    });
}


/*
 *  Function:   Render employee registration page with errors
*/
exports.registerEmployeeErrorPage = function(req, res, webname, user, err) {

    user.getDetails(req.session.userId).then(function(result){
        res.render(path.join(__dirname + '/../views/pages/manager/employee_new.ejs'), {
            title: webname + "| Register | Employee",
            session: req.session,
            csrfToken: req.csrfToken(),
            error: err,
            form: req.body,
            user: result
        });

    // Error getting user details
    }).catch(function(err) {
        module.exports.defaultError(req, res, webname, err);
    })   
}


/*
 *  Function:   Renders new facility creation page with errors
*/
exports.newFacilityErrorPage = function(req, res, webname, user, facility, icons, req_body, err) {

    user.getDetails(req.session.userId).then(function(result) {
        facility.getAllFacilities().then(function(facilities) {
            return res.render(path.join(__dirname + '/../views/pages/manager/facilities_new.ejs'), {
                title: webname + "| Facilities | New",
                session: req.session,
                csrfToken: req.csrfToken(),
                user: result,
                icons: icons,
                error: err,
                facilities: facilities,
                form: req_body
            });

        // Error getting all facilities
        }).catch(function(err) {
            module.exports.defaultError(req, res, webname, err);
        });

    // Error getting user details
    }).catch(function(err) {
        module.exports.defaultError(req, res, webname, err);
    }); 
}


/*
 *  Function:   Renders edit facility page with errors
*/
exports.editFacilityErrorPage = function(req, res, webname, user, icons, err) {
    user.getDetails(req.session.userId).then(function(userObj) {
        user.facilities_discover(req.params['id']).then(function(result) {

            return res.render(path.join(__dirname + '/../views/pages/manager/facilities_edit.ejs'), {
                title: webname + "| Facilities | Edit",
                session: req.session,
                csrfToken: req.csrfToken(),
                user: userObj,
                icons: icons,
                facility: result[0],
                images: result[1],
                error: err
            });

        // Error getting facility details (by id)
        }).catch(function(err) {
            module.exports.defaultError(req, res, webname, err);
        });

    // Error getting user details
    }).catch(function(err) {
        module.exports.defaultError(req, res, webname, err);
    });
}


/*
 *  Function:   Render new activity creation page with errors
*/
exports.newActivityErrorPage = function(req, res, webname, user, facility, req_body, err) {
    user.getDetails(req.session.userId).then(function(result) {
        facility.getAllFacilities().then(function(facilities) {
            facility.getAllSports().then(function(sports) {
                facility.getAllActivities().then(function(activities) {
                    return res.render(path.join(__dirname + '/../views/pages/manager/activities_new.ejs'), {
                        title: webname + "| Activities | New",
                        session: req.session,
                        csrfToken: req.csrfToken(),
                        user: result,
                        facilities: facilities,
                        sports: sports,
                        error: err,
                        activities: activities,
                        form: req_body
                    });
                
                // Error getting all activities
                }).catch(function(err) {
                    module.exports.defaultError(req, res, webname, err);
                });
                
            // Error getting all sports
            }).catch(function(err) {
                module.exports.defaultError(req, res, webname, err);
            });

        // Error getting all facilities
        }).catch(function(err) {
            module.exports.defaultError(req, res, webname, err);
        });

    // Error getting user details
    }).catch(function(err) {
        module.exports.defaultError(req, res, webname, err);
    });
}


/*
 *  Function:   Renders edit activity page with errors
*/
exports.editActivityErrorPage = function(req, res, webname, user, facility, employee, err) {
    user.getDetails(req.session.userId).then(function(userObj) {
        user.getActivity(req.params['id']).then(function(result) {
            facility.getAllFacilities().then(function(facilities) {
                facility.getAllSports().then(function(sports) {
                    employee.getActivityImages(req.params['id']).then(function(images) {
                        date = moment(result.start_time).format('YYYY-MM-DD');
                        time = moment(result.start_time).format('HH:mm');

                        return res.render(path.join(__dirname + '/../views/pages/manager/activities_edit.ejs'), {
                            title: webname + "| Activities | Edit",
                            session: req.session,
                            csrfToken: req.csrfToken(),
                            user: userObj,
                            activity: result,
                            images: images,
                            date: date,
                            time: time,
                            facilities: facilities,
                            sports: sports,
                            error: err
                        });

                    // Error getting activity images
                    }).catch(function(err) {
                        module.exports.defaultError(req, res, webname, err);
                    });

                // Error getting all sports
                }).catch(function(err) {
                    module.exports.defaultError(req, res, webname, err);
                });

            // Error getting all facilities
            }).catch(function(err) {
                module.exports.defaultError(req, res, webname, err);
            });

        // Error getting activity object
        }).catch(function(err) {
            module.exports.defaultError(req, res, webname, err);
        });

    // Error getting user details
    }).catch(function(err) {
        module.exports.defaultError(req, res, webname, err);
    });
}


/*
 *  Function:   Render update login details page with errors
*/
exports.updateErrorPage = function(req, res, webname, user, err) {
    
    user.getDetails(req.session.userId).then(function(result) {

        // Render data
        res.render(path.join(__dirname + '/../views/pages/account/account-details.ejs'),
        {
            title: webname + "| Account | Details",
            session: req.session,
            user: result,
            error: err,
            csrfToken: req.csrfToken()
        });
        
    // Error getting user details
    }).catch(function(err) {
        
        module.exports.defaultError(req, res, webname, err);
    });
}


/*
 *  Function:  Render Create card payment option with errors 
*/
exports.cardPaymentErrorPage = function(req, res, webname, user, err) {
    user.getDetails(req.session.userId).then(function(result) {

        // Cards
        user.getCards(req.session.userId).then(function(cards){
            var cardId = 0;
                if (cards.length > 0) cardId = cards[0].id;

            // Payment history
            user.getPayments(req.session.userId, cardId).then(function(payments) {
                // Cash payment history
                user.getPaymentsCash(req.session.userId).then(function(cashPayments) {
                    // Render

                    res.render(path.join(__dirname + '/../views/pages/account/account-payment-details.ejs'),
                    {
                        title: webname + "| Account | Payment",
                        session: req.session,
                        user: result,
                        cards: cards,
                        payments: payments,
                        cashPayments: cashPayments,
                        error: err,
                        form: req.body,
                        csrfToken: req.csrfToken()
                    });

                // Error getting user cash payments (history)
                }).catch(function(err) {
                    module.exports.defaultError(req, res, webname, err);
                });

            // Error getting user payments (history)
            }).catch(function(err) {
                module.exports.defaultError(req, res, webname, err);
            });

        // Error getting user cards
        }).catch(function(err){

            module.exports.defaultError(req, res, webname, err);
        });
        
    // Error getting user details
    }).catch(function(err) {
        
        module.exports.defaultError(req, res, webname, err);
    });
}


/*
 *  Function:   Cash payment error
*/
exports.cashPaymentError = function(req, res, webname, user, facility, employee, err) {
    user.getDetails(req.session.userId).then(function(result) {
        employee.getEmployeePayments(req.session.userId).then(function(payments) {

            facility.getAllActivities().then(function(activities) {
                return res.render(path.join(__dirname + '/../views/pages/account/account-cash-payment.ejs'), {
                    title: webname + "| Account | Payments | Cash",
                    session: req.session,
                    csrfToken: req.csrfToken(),
                    user: result,
                    activities: activities,
                    payments: payments,
                    error: err,
                    form: req.body
                });
    
            // Error getting all activities
            }).catch(function(err) {
    
                module.exports.defaultError(req, res, webname, err);
            });

        // Error getting all employee payments (by id)
        }).catch(function(err) {
            module.exports.defaultError(req, res, webname, err);

        });

    // Error getting user details
    }).catch(function(err) {

        module.exports.defaultError(req, res, webname, err);
    });
}


/*
 *  Function:   Default redirect to error page with description
*/
exports.defaultError = function (req, res, webname, err){

    // Render with error
    res.render(path.join(__dirname + '/../views/pages/error.ejs'),
    {
        title: "Oops an error occured!",
        session: req.session,
        error: err
    });
}
