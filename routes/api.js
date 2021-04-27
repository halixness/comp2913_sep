/*
    api.js
        -- Rest api api to privide an interface for the mobile app to interact 
        with the database

    Contributers
        -- Joe Jeffcock
        -- Diego Calanzone
*/


// Variable declarations
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const validation = require('../modules/validation');
var moment = require('moment');
var user = require('../modules/user');
var employee = require('../modules/employee');
var busboy = require('busboy');
var fs = require('fs');
var urlEncoded = bodyParser.urlencoded({ extended: true });
var jsonEncoded = bodyParser.json();

// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));

// Website header
const webname = ' The Edgy ';


/*
 *  Function:   Login API Endpoind
*/
router.post('/login', jsonEncoded, function(req, res) {

    try { 
        // Validation
        const value = validation.apiLoginValidation(req.body);
        
        if(value.error != undefined) {
            throw value.error.details;
        }

        // Data
        let email = req.body.email;
        let password = req.body.password;

        // Query
        user.loginUser(email, password).then(function(user){

            /*

                // Session creation
                const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
                res.header('auth-token',token).send(token);

            */

           res.setHeader('Content-Type', 'application/json');
           res.end(
               JSON.stringify(user)
           );

        // Error
        }). catch(function(err){

            res.setHeader('Content-Type', 'application/json');
            res.end(
                JSON.stringify(err)
            );
        });

    } catch(err) {

        res.setHeader('Content-Type', 'application/json');
        res.end(
            JSON.stringify(err)
        );
    }
});


/*
 *  Function:   Register API Endpoind
*/
router.post('/register', jsonEncoded, function(req, res) {

    try { 
        // Validation
        const value = validation.apiRegisterValidation(req.body);
        
        if(value.error != undefined) {
            throw value.error.details;
        }

        // Formatting
        req.body.birth = moment(req.body.birth).format('YYYY-MM-DD');

        // Query
        user.registerUser(req.body).then(function(result){

            /*

                // Session creation
                const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
                res.header('auth-token',token).send(token);

            */

           res.setHeader('Content-Type', 'application/json');
           res.end(
               JSON.stringify(result)
           );

        // Error
        }). catch(function(err){

            res.setHeader('Content-Type', 'application/json');
            res.end(
                JSON.stringify(err)
            );
        });

    } catch(err) {

        res.setHeader('Content-Type', 'application/json');
        res.end(
            JSON.stringify(err)
        );
    }
});


/*
 *  Function:   New facility API Endpoint
*/
router.post('/upload_facility', jsonEncoded, function(req, res) {

    // Validation
    var bboy = new busboy({ headers : req.headers });
    var img_id_list = [];
    var req_body = {};
    
    // Fields - push to json
    bboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        console.log(val);
        req_body[fieldname] = val;
    });

    // Files - upload images and append image id to list
    bboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var ext = mimetype.split('/')[1];

        // validate img type
        if (!(mimetype == 'image/png' || mimetype == 'image/jpg' || mimetype == 'image/jpeg'))
            return res.end('invalid filetype!');

        // create db entry then save image to src/uploads/ using returned id
        employee.newImage(ext).then(function(results){
            var id = results[1][0].id;
            var output_path = __dirname + '/../src/uploads/' + id + '.' + ext;
            file.pipe(fs.createWriteStream(output_path));

            img_id_list.push(id);

        }).catch(function(err){

            return res.end('file upload error');
        });
    });

    bboy.on('finish', function() {
        employee.newFacility(req_body).then(function (results) {
            var facility_id = results[1][0].id;

            for (var i = 0; i < img_id_list.length; ++i) {
                employee.newFacilityImage(facility_id, img_id_list[i]).then(function (results){});
            }
        });
        console.log('done');
        res.end('done');
    });

    try {
        return req.pipe(bboy);
    } catch(err) {

        res.setHeader('Content-Type', 'application/json');
        res.end(
            JSON.stringify(err)
        );
    }
});


/*
 *  Function:   New activity API Endpoint
*/
router.post('/upload_activity', jsonEncoded, function(req, res) {

    // Validation
    var bboy = new busboy({ headers : req.headers });
    var img_id_list = [];
    var req_body = {};
    
    // Fields - push to json
    bboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        console.log(val);
        req_body[fieldname] = val;
    });

    // Files - upload images and append image id to list
    bboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var ext = mimetype.split('/')[1];

        // validate img type
        if (!(mimetype == 'image/png' || mimetype == 'image/jpg' || mimetype == 'image/jpeg'))
            return res.end('invalid filetype!');

        // create db entry then save image to src/uploads/ using returned id
        employee.newImage(ext).then(function(results){
            var id = results[1][0].id;
            var output_path = __dirname + '/../src/uploads/' + id + '.' + ext;
            file.pipe(fs.createWriteStream(output_path));

            img_id_list.push(id);

        }).catch(function(err){

            return res.end('file upload error');
        });
    });

    bboy.on('finish', function() {
        employee.newActivity(req_body).then(function (results) {
            console.log('broken here!');
            console.log(results);

            var activity_id = results[1][0].id;

            console.log('broken here?');

            for (var i = 0; i < img_id_list.length; ++i) {
                employee.newActivityImage(activity_id, img_id_list[i]).then(function (results){});
            }
            console.log('or here?');

        });
        console.log('done');
        res.end('done');
    });

    try {
        return req.pipe(bboy);
    } catch(err) {

        res.setHeader('Content-Type', 'application/json');
        res.end(
            JSON.stringify(err)
        );
    }
});


// Exports
module.exports = router;