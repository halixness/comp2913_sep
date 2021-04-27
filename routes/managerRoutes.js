/*
    managerRoutes.js
        -- Routes for the manager ; routes that only the manager can
        take.

    To do:
        -- replce console.log, logout in err with default error

    Contributers
        -- Samuel Barnes
        -- Joe Jeffcock
        -- Diego Calanzone
*/


// Variable declarations
const express = require('express');
const validation = require('../modules/validation');
const jwt = require('jsonwebtoken');
var path = require('path');
const router = express.Router();
var user = require('../modules/user');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var error = require('../modules/error');
var report = require('../modules/report');
var facility = require('../modules/facility');
var employee = require('../modules/employee');
var moment = require('moment');
var busboy = require('busboy');
var fs = require('fs');

// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(csurf({ cookie: true }));

// Website header
const webname = ' The Edgy ';


/*
 *  Function:   Register Employee GET
*/
router.get('/register/employee', function(req, res) {
    if(req.session.userId == undefined || req.session.userType < 3)     // If not an admin, redirect
        res.redirect('/user/logout');

    else {
        user.getDetails(req.session.userId).then(function(result) {     // Get the user detaild

            // Render the page
            res.render(path.join(__dirname + '/../views/pages/manager/employee_new.ejs'), {
                title: webname + "| Register | Employee",
                session: req.session,
                csrfToken: req.csrfToken(),
                form: req.body,
                user: result
            });

        // Error getting user details
        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout'); 
        });
    }
});


/*
 *  Function:   Register Employee POST
*/
router.post('/register/employee', function(req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin, redirect
        res.redirect('/user/logout');

    else {  
        try {
            const value = validation.registerValidation(req.body);   

            // Error in validation
            if(value.error != undefined)
                throw value.error.details;

            user.checkEmailRegistered(req.body.email).then(function(email) {
                if (email == true) throw[{
                    message: 'Email already registered',
                    path: 'email'
                }];

                user.registerUser(req.body).then(function(result) {
                    error.registerEmployeeErrorPage(req, res, webname, user, [{
                        message: "Employee Created successfully",
                        path: 'success'
                    }]);
            
                // Catch error when registering new user to DB
                }).catch(function(err) {
                    error.registerEmployeeErrorPage(req, res, webname, user, [{
                        message: err,
                        path: 'unsuccessful'
                    }]);
                }); 

            // Catch error when checking if email is already registered (if something wrong with this query)
            }).catch(function(err) {
                error.registerEmployeeErrorPage(req, res, webname, user, err);
            });

        // Catch all other errors thrown
        } catch(err) {
            error.registerEmployeeErrorPage(req, res, webname, user, err);
        }
    }
});


/*
 *  Function:   Statistics page
*/
router.get('/statistics', function(req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin, redirect
        res.redirect('/user/logout');

    else {
        var queries = [
            user.getDetails(req.session.userId)
        ];

        // Look at this ninja way to solve all the asynch queries
        Promise.all(queries).then(results => { 
        
            var user = results[0];

            // Render results
            res.render(path.join(__dirname + '/../views/pages/manager/statistics.ejs'), {
                title: webname + "| Statistics",
                session: req.session,
                csrfToken: req.csrfToken(),
                user: user
            });

        // Catch errors
        }).catch(function(error){

            console.log(error);
            //res.redirect('/user/logout');  
        });
    } 
});


/*
 * Function:    Manager overview page
*/
router.get('/overview', function(req, res) { 
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin, redirect
        res.redirect('/user/logout');

    else {
        user.getDetails(req.session.userId).then(function(result) { // Get the user details

            // Render the page
            res.render(path.join(__dirname + '/../views/pages/manager/account_manager.ejs'), {
                title: webname + "| Manager | Overview",
                session: req.session,
                user: result
            });

        // Error getting user details
        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout'); 
        });
    }    
});


/*
 * Function:    configure activities page GET 
*/
router.get('/activities/new', function (req, res) {   
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin, redirect
        res.redirect('/home');

    else {
        user.getDetails(req.session.userId).then(function(result) {                 // Get the user details
            facility.getAllFacilities().then(function(facilities) {                 // Get all the facilities for use in creating a new activity
                facility.getAllSports().then(function(sports) {                     // Get all the sports for use in creating a new activity
                    facility.getAllActivities().then(function(activities) {         // Get all the activities for use in configuring existing activities

                        // Render the page
                        return res.render(path.join(__dirname + '/../views/pages/manager/activities_new.ejs'), {
                            title: webname + "| Activities | New",
                            session: req.session,
                            csrfToken: req.csrfToken(),
                            user: result,
                            facilities: facilities,
                            sports: sports,
                            activities: activities,
                            form: req.body
                        });
                        
                    // Error getting all the activities
                    }).catch(function(err) {                                                
                        console.log(err);
                        res.redirect('/user/logout');
                    });
                    
                // Error getting all the sports
                }).catch(function(err) {
                    console.log(err);
                    res.redirect('/user/logout');
                });

            // Error getting all the facilities
            }).catch(function(err) {
                console.log(err);
                res.redirect('/user/logout');
            });

        // Error getting user details
        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout');
        });
    }
});


/*
 * Function:    Edit Activity GET
*/
router.get('/activities/edit/:id*', function(req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin, redirect
        res.redirect('/home');

    else {
        user.getDetails(req.session.userId).then(function(userObj) {                         // Get the user details
            user.getActivity(req.params['id']).then(function(result) {                       // Get the specific activity details from the ID    
                facility.getAllFacilities().then(function(facilities) {                      // Get all the facilities for editing the activity
                    facility.getAllSports().then(function(sports) {                          // Get all the sports for editing the activity
                        employee.getActivityImages(req.params['id']).then(function(images) { // Get all the images for the specific activity, from the ID
                            
                            // Seperate date and time from start_time
                            date = moment(result.start_time).format('YYYY-MM-DD');
                            time = moment(result.start_time).format('HH:mm');

                            // Render the page
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
                                sports: sports
                            });
                        
                        // Error getting the activity images
                        }).catch(function(err) {
                            console.log(err);
                            res.redirect('/user/logout');
                        });

                    // Error getting all the sports
                    }).catch(function(err) {
                        console.log(err);
                        res.redirect('/user/logout');

                    });

                // Error getting all the facilities
                }).catch(function(err) {
                    console.log(err);
                    res.redirect('/user/logout');
                });

            // Error getting the activity details
            }).catch(function(err) {
                console.log(err);
                res.redirect('/user/logout');
            });      

        // Error getting the user details
        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout');  
        });   
    }
});


/*
 * Function:    Edit Activity POST
*/
router.post('/activities/edit/:id*', function(req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin, redirect
        res.redirect('/home');

    else {
        try {
            // Validation
            var bboy = new busboy({ headers : req.headers });
            var img_id_list = [];
            var req_body = {};
            
            // Fields - push to json
            bboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
                req_body[fieldname] = val;
            });


            // Files - upload images and append image id to list
            bboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                var ext = mimetype.split('/')[1];

                if (filename != "") {
                    // validate img type
                    if (!(mimetype == 'image/png' || mimetype == 'image/jpg' || mimetype == 'image/jpeg'))
                        return error.editActivityErrorPage(req, res, webname, user, facility, employee, [{
                            message: "Invalid File Type",
                            path: "image"
                        }]);

                    // create db entry then save image to src/uploads/ using returned id
                    employee.newImage(ext).then(function(results){
                        var id = results[1][0].id;
                        var output_path = __dirname + '/../src/uploads/' + id + '.' + ext;
                        file.pipe(fs.createWriteStream(output_path));

                        img_id_list.push(id);

                    // Catch error when uploading Image
                    }).catch(function(err){
                        return error.editActivityErrorPage(req, res, webname, user, facility, employee, [{
                            message: err,
                            path: 'unsuccessful'
                        }]);
                    });

                // if image is not uploaded, skip
                } else {
                    file.resume();
                }
            });

            bboy.on('finish', function() {
                const value = validation.newActivityValidation(req_body);   

                // Error with validation of fields
                if(value.error != undefined)
                    return error.editActivityErrorPage(req, res, webname, user, facility, employee, value.error.details);

                employee.editActivity(req_body, req.params['id']).then(function (results) {
                    var activity_id = req.params['id'];
                
                    for (var i = 0; i < img_id_list.length; ++i) {
                        employee.newActivityImage(activity_id, img_id_list[i]).then(function (results){});
                    }
                    return 'success'
                
                // Catch error when adding new activity to DB    
                }).catch(function(err) {
                    return error.editActivityErrorPage(req, res, webname, user, facility, employee, [{
                        message: err,
                        path: 'unsuccessful'
                    }]);
                });

                // When the activity is created successfully
                return error.editActivityErrorPage(req, res, webname, user, facility, employee, [{
                    message: "Activity Edited successfully",
                    path: 'success'
                }]);
            });

            try {
                return req.pipe(bboy);
            } catch(err) {
        
                res.setHeader('Content-Type', 'application/json');
                res.end(
                    JSON.stringify(err)
                );
            }

        // Catch all other errors
        } catch (err) {
            return error.editActivityErrorPage(req, res, webname, user, facility, employee, err);
        }
    }
})


/*
 * Function:    configure activities page POST (for new activity)
*/
router.post('/activities/new', function (req, res) {  
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin, redirect
        res.redirect('/home');

    else {
        try {
            // Validation
            var bboy = new busboy({ headers : req.headers });
            var img_id_list = [];
            var req_body = {};
            
            // Fields - push to json
            bboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
                req_body[fieldname] = val;
            });

            // Files - upload images and append image id to list
            bboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                var ext = mimetype.split('/')[1];

                if (filename != "") {

                    // validate img type
                    if (!(mimetype == 'image/png' || mimetype == 'image/jpg' || mimetype == 'image/jpeg'))
                        return error.newActivityErrorPage(req, res, webname, user, facility, req_body, [{
                            message: "Invalid File Type",
                            path: "image"
                        }]);

                    // create db entry then save image to src/uploads/ using returned id
                    employee.newImage(ext).then(function(results){
                        var id = results[1][0].id;
                        var output_path = __dirname + '/../src/uploads/' + id + '.' + ext;
                        file.pipe(fs.createWriteStream(output_path));

                        img_id_list.push(id);

                    // Catch error when uploading Image
                    }).catch(function(err){
                        return error.newActivityErrorPage(req, res, webname, user, facility, req_body, [{
                            message: err,
                            path: 'unsuccessful'
                        }]);
                    });

                // if image is not uploaded, skip
                } else {    
                    file.resume();
                }
            });


            bboy.on('finish', function() {
                const value = validation.newActivityValidation(req_body);   

                // Error with validation of fields
                if(value.error != undefined)
                    return error.newActivityErrorPage(req, res, webname, user, facility, req_body, value.error.details);

                console.log(req_body.discount, req_body.cost);

                if (Number(req_body.cost) > 0) {
                    if (Number(req_body.discount) >= Number(req_body.cost)) {
                        return error.newActivityErrorPage(req, res, webname, user, facility, req_body, [{
                            message: "Discount must be less than cost",
                            path: 'discount'
                        }]);
                    }
                } else {
                    if (Number(req_body.discount) > Number(req_body.cost)) {
                        return error.newActivityErrorPage(req, res, webname, user, facility, req_body, [{
                            message: "Discount must be less than cost",
                            path: 'discount'
                        }]);
                    }
                }

                employee.newActivity(req_body).then(function (results) {
                    var activity_id = results[1][0].id;
                
                    for (var i = 0; i < img_id_list.length; ++i) {
                        employee.newActivityImage(activity_id, img_id_list[i]).then(function (results){});
                    }
                    return 'success'

                
                // Catch error when adding new activity to DB    
                }).catch(function(err) {
                    return error.newActivityErrorPage(req, res, webname, user, facility, req_body, [{
                        message: err,
                        path: 'unsuccessful'
                    }]);
                });

                // When the activity is created successfully
                return error.newActivityErrorPage(req, res, webname, user, facility, req_body, [{
                    message: "Activity Created successfully",
                    path: 'success'
                }]);
            });

            try {
                return req.pipe(bboy);
            } catch(err) {
        
                res.setHeader('Content-Type', 'application/json');
                res.end(
                    JSON.stringify(err)
                );
            }

        // Catch all other errors thrown
        } catch(err) {
            console.log(err) // For debugging
            error.newActivityErrorPage(req, res, webname, user, facility, {}, err);
        }
    }
});


/*
 * Function:    configure facilities GET
*/
router.get('/facilities/new', function (req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // if not an admin, redirect
        res.redirect('/home');

    else {
        icons = ['basketball', 'gym', 'running', 'sport', 'swim', 'tennis'];

        user.getDetails(req.session.userId).then(function(result) {     // Get the user details 
            facility.getAllFacilities().then(function(facilities) {     // Get all the facilities for use in configuring an existing facility

                // Render the page
                return res.render(path.join(__dirname + '/../views/pages/manager/facilities_new.ejs'), {
                    title: webname + "| Facilities | New",
                    session: req.session,
                    csrfToken: req.csrfToken(),
                    user: result,
                    icons: icons,
                    facilities: facilities,
                    form: req.body
                });

            // Error getting all facilities
            }).catch(function(err) {
                console.log(err);
                res.redirect('/user/logout');
            });

        // Error getting user details
        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout');
        });    
    }
});


/*
 *  Function:   New Facility POST (for new facility)
*/
router.post('/facilities/new', function(req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // if not an admin, redirect
        res.redirect('/home');

    else {
        icons = ['basketball', 'gym', 'running', 'sport', 'swim', 'tennis'];

        try {
            
            // Validation
            var bboy = new busboy({ headers : req.headers });
            var img_id_list = [];
            var req_body = {};

            // Fields - push to json
            bboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
                req_body[fieldname] = val;
            });


            // Files - upload images and append image id to list
            bboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                var ext = mimetype.split('/')[1];

                // validate img type
                if (!(mimetype == 'image/png' || mimetype == 'image/jpg' || mimetype == 'image/jpeg')) {
                    return error.newFacilityErrorPage(req, res, webname, user, facility, icons, req_body, [{
                        message: "Invalid File Type",
                        path: "image"
                    }]);

                }

                // create db entry then save image to src/uploads/ using returned id
                employee.newImage(ext).then(function(results){
                    var id = results[1][0].id;
                    var output_path = __dirname + '/../src/uploads/' + id + '.' + ext;
                    file.pipe(fs.createWriteStream(output_path));

                    img_id_list.push(id);

                // Catch error when uploading new image to dir
                }).catch(function(err){
                    return error.newFacilityErrorPage(req, res, webname, user, facility, icons, req_body, [{
                        message: err,
                        path: 'unsuccessful'
                    }]);
                });
            });

            bboy.on('finish', function() {
                const value = validation.newFacilityValidation(req_body);   

                // Error
                if(value.error != undefined)
                    return error.newFacilityErrorPage(req, res, webname, user, facility, icons, req_body, value.error.details);

                
                employee.newFacility(req_body).then(function (results) {
                    var facility_id = results[1][0].id;
        
                    for (var i = 0; i < img_id_list.length; ++i) {
                        employee.newFacilityImage(facility_id, img_id_list[i]).then(function (results){});
                    }
                    return 'success'

                // Catch error when adding new facility to the DB 
                }).catch(function(err) {
                    return error.newFacilityErrorPage(req, res, webname, user, facility, icons, req_body, [{
                        message: err,
                        path: 'unsuccessful'
                    }]);

                });
                
                // When the facility is created successfully
                return error.newFacilityErrorPage(req, res, webname, user, facility, icons, req_body, [{
                    message: "Facility Created successfully",
                    path: 'success'
                }]);
            });

            try {
                return req.pipe(bboy);
            } catch(err) {
        
                res.setHeader('Content-Type', 'application/json');
                res.end(
                    JSON.stringify(err)
                );
            }

        // Catch all other errors thrown
        } catch (err) {
            error.newFacilityErrorPage(req, res, webname, user, facility, icons, {}, err);
        }
    }
})


/*
 * Function:    Edit Facility GET
*/
router.get('/facilities/edit/:id*', function(req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin, redirect
        res.redirect('/home');

    else {
        icons = ['basketball', 'gym', 'running', 'sport', 'swim', 'tennis'];

        user.getDetails(req.session.userId).then(function(userObj) {
            user.facilities_discover(req.params['id']).then(function(result) {
                return res.render(path.join(__dirname + '/../views/pages/manager/facilities_edit.ejs'), {
                    title: webname + "| Facilities | Edit",
                    session: req.session,
                    csrfToken: req.csrfToken(),
                    user: userObj,
                    icons: icons,
                    facility: result[0],
                    images: result[1]
                });

            // Error getting facility details (by id)
            }).catch(function(err) {
                console.log(err);
                res.redirect('/user/logout');
            });

        // Error getting user details
        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout');
        });
    }
});


/*
 * Function:    Edit Activity POST
*/
router.post('/facilities/edit/:id*', function(req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin, redirect
        res.redirect('/home');

    else {
        icons = ['basketball', 'gym', 'running', 'sport', 'swim', 'tennis'];

        try {

            // Validation
            var bboy = new busboy({ headers : req.headers });
            var img_id_list = [];
            var req_body = {};

            // Fields - push to json
            bboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
                req_body[fieldname] = val;
            });


            // Files - upload images and append image id to list
            bboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                var ext = mimetype.split('/')[1];

                if (filename != "") {
                    
                    // validate img type
                    if (!(mimetype == 'image/png' || mimetype == 'image/jpg' || mimetype == 'image/jpeg')) {
                        return error.editFacilityErrorPage(req, res, webname, user, icons, [{
                            message: "Invalid File Type",
                            path: 'image'
                        }]);

                    }

                    // create db entry then save image to src/uploads/ using returned id
                    employee.newImage(ext).then(function(results){
                        var id = results[1][0].id;
                        var output_path = __dirname + '/../src/uploads/' + id + '.' + ext;
                        file.pipe(fs.createWriteStream(output_path));

                        img_id_list.push(id);

                    // Catch error when uploading new image to dir
                    }).catch(function(err){
                        return error.editFacilityErrorPage(req, res, webname, user, icons, [{
                            message: err,
                            path: 'unsuccessful'
                        }]);
                    });
                } else {
                    // when there is no file to upload
                    file.resume();
                }
            });

            bboy.on('finish', function() {

                const value = validation.newFacilityValidation(req_body);   

                // Error
                if(value.error != undefined)
                    return error.editFacilityErrorPage(req, res, webname, user, icons, value.error.details);


                
                employee.editFacility(req_body, req.params['id']).then(function (results) {
                    var facility_id = req.params['id'];
        
                    for (var i = 0; i < img_id_list.length; ++i) {
                        employee.newFacilityImage(facility_id, img_id_list[i]).then(function (results){});
                    }
                    return 'success'

                // Catch error when adding new facility to the DB 
                }).catch(function(err) {
                    return error.editFacilityErrorPage(req, res, webname, user, icons, [{
                        message: err,
                        path: 'unsuccessful'
                    }]);

                });
                
                // When the facility is created successfully
                return error.editFacilityErrorPage(req, res, webname, user, icons, [{
                    message: "Facility updated successfully",
                    path: 'success'
                }]);
            });

            try {
                return req.pipe(bboy);
            } catch(err) {
        
                res.setHeader('Content-Type', 'application/json');
                res.end(
                    JSON.stringify(err)
                );
            }

        // Catch all other errors
        } catch (err) {
            error.editFacilityErrorPage(req, res, webname, user, icons, err);
        }
    }
});


// Exports
module.exports = router;