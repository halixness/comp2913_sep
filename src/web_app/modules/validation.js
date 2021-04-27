/*
    validation.js
        -- Functions to validate user inputs from forms and return meaningful error messages

    To do:
        -- add comment headers to all functions *

    Contributers
        -- Samuel Barnes
        -- Joe Jeffcock
        -- Artyom Tiunelis
        -- Diego Calanzone
*/


// Variable declarations
const joi = require('@hapi/joi');


/*
 *  Function:   Register form (whole form) Validation 
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const registerValidation = function(data){

    const registerValidationSchema = joi.object({
        name: joi.string()
            .min(3)
            .required()
            .messages({
                "string.empty": "Firstname is required",
                "string.min": "Firstname must be at least 3 characters long"
            }),
        surname: joi.string()
            .min(3)
            .required()
            .messages({
                "string.empty": "Surname is required",
                "string.min": "Surname must be at least 3 characters"
            }),
        email: joi.string()
            .min(6)
            .required()
            .email()
            .messages({
                "string.empty": "Email is Required",
                "string.min": "Email must be at least 6 characters long",
                "string.email": "Invalid Email Address"
            }),
        birth: joi.string()
            .required()
            .messages({
                "string.empty": "Date of Birth is Required"
            }),
        phone: joi.number()
            .required()
            .messages({
                "number.base": "Phone Number Invalid"
            }),
        address_1: joi.string()
            .required()
            .messages({
                "string.empty": "Address Line 1 is Required"
            }),
        address_2: joi.string()
            .allow(''),
        zipcode: joi.string()
            .required()
            .messages({
                "string.empty": "Postal / Zip Code is Required"
            }),
        city: joi.string()
            .required()
            .messages({
                "string.empty": "City is Required"
            }),
        password: joi.string()
            .min(6)
            .required()
            .messages({
                "string.empty": "Password is Required",
                "string.min": "Password must be at least 6 characters long"
            }),
        confirm_password: joi.any()
            .valid(joi.ref('password'))
            .required()
            .messages({
                "string.empty": "Confirm Password is Required",
                "any.only": "Must match Password"
            }),
        type: joi.number()
            .required(),
        _csrf: joi.string()
            .min(6)
            .required()
        
    });

    return registerValidationSchema.validate(data, {abortEarly: false});
}


/*
 *  Function:   Register form (subform 1) Validation 
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const registerValidation1 = function(data) {
    const registerValidationSchema1 = joi.object({
        name: joi.string()
            .min(3)
            .required()
            .messages({
                "string.empty": "Firstname is required",
                "string.min": "Firstname must be at least 3 characters long"
            }),
        surname: joi.string()
            .min(3)
            .required()
            .messages({
                "string.empty": "Surname is required",
                "string.min": "Surname must be at least 3 characters"
            }),
        email: joi.string()
            .min(6)
            .required()
            .email()
            .messages({
                "string.empty": "Email is Required",
                "string.min": "Email must be at least 6 characters long",
                "string.email": "Invalid Email Address"
            }),
        password: joi.string()
            .min(6)
            .required()
            .messages({
                "string.empty": "Password is Required",
                "string.min": "Password must be at least 6 characters long"
            }),
        confirm_password: joi.any()
            .valid(joi.ref('password'))
            .required()
            .messages({
                "string.empty": "Confirm Password is Required",
                "any.only": "Must match Password"
            }),
        type: joi.number()
            .required(),
        _csrf: joi.string()
            .min(6)
            .required()
    });


    return registerValidationSchema1.validate(data, {abortEarly: false});
}


/*
 *  Function:   Register form (subform 2) Validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const registerValidation2 = function(data) {
    const registerValidationSchema2 = joi.object({
        birth: joi.string()
            .required()
            .messages({
                "string.empty": "Date of Birth is Required"
            }),
        phone: joi.number()
            .required()
            .messages({
                "number.base": "Phone Number Invalid"
            }),
        _csrf: joi.string()
            .min(6)
            .required()
    });

    return registerValidationSchema2.validate(data, {abortEarly: false});
}   


/*
 *  Function:   Register form (subform 3) Validation (ALSO USED FOR UPDATE VALIDATION)
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const registerValidation3 = function(data) {
    const registerValidationSchema3 = joi.object({
        address_1: joi.string()
            .required()
            .messages({
                "string.empty": "Address Line 1 is Required"
            }),
        address_2: joi.string()
            .allow(''),
        zipcode: joi.string()
            .required()
            .messages({
                "string.empty": "Postal / Zip Code is Required"
            }),
        city: joi.string()
            .required()
            .messages({
                "string.empty": "City is Required"
            }),
        _csrf: joi.string()
            .min(6)
            .required()
    });

    return registerValidationSchema3.validate(data, {abortEarly: false});
}



/*
 *  Function:   Update details validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const updateDetailsValidation = function(data) {
    const updateDetailsValidationSchema = joi.object({
        name: joi.string()
            .min(3)
            .required()
            .messages({
                "string.empty": "Firstname is required",
                "string.min": "Firstname must be at least 3 characters long"
            }),
        surname: joi.string()
            .min(3)
            .required()
            .messages({
                "string.empty": "Surname is required",
                "string.min": "Surname must be at least 3 characters"
            }),
        email: joi.string()
            .min(6)
            .required()
            .email()
            .messages({
                "string.empty": "Email is Required",
                "string.min": "Email must be at least 6 characters long",
                "string.email": "Invalid Email Address"
            }),
        phone: joi.number()
            .required()
            .messages({
                "number.base": "Phone Number Invalid"
            }),
        _csrf: joi.string()
            .min(6)
            .required()
    });

    return updateDetailsValidationSchema.validate(data, {abortEarly: false});
}



/*
 *  Function:   update password validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const updatePasswordValidation = function(data) {
    const updatePasswordValidationSchema = joi.object({
        current_password: joi.string()
            .min(6)
            .required()
            .messages({
                "string.empty": "Password is Required",
                "string.min": "Password must be at least 6 characters long"
            }),
        password: joi.string()
            .min(6)
            .required()
            .messages({
                "string.empty": "Password is Required",
                "string.min": "Password must be at least 6 characters long"
            }),
        confirm_password: joi.any()
            .valid(joi.ref('password'))
            .required()
            .messages({
                "string.empty": "Confirm Password is Required",
                "any.only": "Must match Password"
            }),
        _csrf: joi.string()
            .min(6)
            .required()
    });

    return updatePasswordValidationSchema.validate(data, {abortEarly: false});
}


/*
 *  Function:   new facility validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const newFacilityValidation = function(data) {
    const newFacilityValidationSchema = joi.object({
        name: joi.string()
            .min(3)
            .required()
            .messages({
                "string.empty": "Name is required",
                "string.min": "Name must be at least 3 characters long"
            }), 
        price: joi.number()
            .required()
            .messages({
                "number.base": "Price Invalid"
            }),
        capacity: joi.number()
            .required()
            .messages({
                "number.base": "Capacity Invalid"
            }),
        description: joi.string()
            .required()
            .messages({
                "string.empty": "Description is required"
            }),
        icon: joi.string()
            .required(),
        _csrf: joi.string()
            .min(6)
            .required()
    });

    return newFacilityValidationSchema.validate(data, {abortEarly: false});
}


/*
 *  Function:   new activity validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const newActivityValidation = function(data) {
    const newActivityValidationSchema = joi.object({
        name: joi.string()
            .min(3)
            .required()
            .messages({
                "string.empty": "Name is required",
                "string.min": "Name must be at least 3 characters long"
            }),
        description: joi.string()
            .required()
            .messages({
                "string.empty": "Description is required"
            }),
        discount: joi.number()
            .allow('')
            .messages({
                "number.base": "Discount Invalid"
            }),
        cost: joi.number()
            .required()
            .messages({
                "number.base": "Price Invalid"
            }),
        date: joi.string()
            .required()
            .messages({
                "string.empty": "Date is Required"
            }),
        time: joi.string()
            .required()
            .messages({
                "string.empty": "Time is Required"
            }),
        duration: joi.number()
            .required()
            .messages({
                "number.base": "Duration Invalid"
            }),
        id_sport: joi.number()
            .required(),
        id_facility: joi.number()
            .required(),
        _csrf: joi.string()
            .min(6)
            .required()
    });

    return newActivityValidationSchema.validate(data, {abortEarly: false});
}


/*
 *  Function:   cash payment validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const cashPaymentValidation = function(data) {
    const cashPaymentValidationSchema = joi.object({
        amount: joi.number()
            .required()
            .messages({
                "number.base": "Amount Invalid"
            }),
        email: joi.string()
            .min(6)
            .required()
            .email()
            .messages({
                "string.empty": "Email is Required",
                "string.min": "Email must be at least 6 characters long",
                "string.email": "Invalid Email Address"
            }),
        activity_id: joi.number()
            .required(),
        _csrf: joi.string()
            .min(6)
            .required()
    });

    return cashPaymentValidationSchema.validate(data, {abortEarly: false});
}


/*
 *  Function:   API Register Validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const apiRegisterValidation = function(data){

    const registerValidationSchema = joi.object({
        name: joi.string()
            .min(3)
            .required(),
        surname: joi.string()
            .min(3)
            .required(),
        email: joi.string()
            .min(6)
            .required()
            .email(),
        birth: joi.string()
            .required(),
        phone: joi.number()
            .required(),
        address_1: joi.string()
            .required(),
        address_2: joi.string()
            .allow(''),
        zipcode: joi.string()
            .required(),
        city: joi.string()
            .required(),
        password: joi.string()
            .min(6)
            .required(), // Need another field, confirm password, which must be validated to be equal to password.
        confirm_password: joi.string()
            .min(6)
            .required(), // Need another field, confirm password, which must be validated to be equal to password.
        
    });

    return registerValidationSchema.validate(data, {abortEarly: false});
}


/*
 *  Function:   Login Validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const loginValidation = function(data){

    const LoginValidationSchema = joi.object({
        email: joi.string()
            .min(6)
            .required()
            .email()
            .messages({
                "string.empty": "Email is Required",
                "string.min": "Email must be at least 6 characters long",
                "string.email": "Invalid Email Address"
            }),
        password: joi.string()
            .min(6)
            .required()
            .messages({
                "string.empty": "Password is Required",
                "string.min": "Password must be at least 6 characters long"
            }),
        _csrf: joi.string()
            .min(6)
            .required()
    });
    
    return LoginValidationSchema.validate(data);
}


/*
 *  Function:   API Login Validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const apiLoginValidation = function(data){

    const LoginValidationSchema = joi.object({
        email: joi.string()
            .min(6)
            .required()
            .email(),
        password: joi.string()
            .min(6)
            .required(),
    });
    
    return LoginValidationSchema.validate(data);
}


/*
 *  Function:   API New Activity Validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const apiNewActivityValidation = function(data){

    const registerValidationSchema = joi.object({
        image: joi.any()
            .allow(''),
        discount: joi.string()
            .required(),
        cost: joi.string()
            .required(),
        start_time: joi.string()
            .required(),
        duration: joi.string()
            .required(),
        id_sport: joi.number()
            .required(),
    });

    return registerValidationSchema.validate(data, {abortEarly: false});
}


/*
 *  Function:   new card validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const newCardValidation = function(data){

    const newCardSchema = joi.object({
        card_number: joi.string()
            .length(20)
            .required()
            .messages({
                "string.empty": "Card Number is Required",
                "string.length": "Card Number must be 20 characters long",
            }),
        expire_date: joi.string()
            .length(5)
            .required()
            .messages({
                "string.empty": "Expire Date is Required",
                "string.length": "Invalid Expire Date"
            }),
        cvv: joi.string()
            .length(3)
            .required()
            .messages({
                "string.empty": "CVV is Required",
                "string.length": "CVV must be 3 characters long"
            }),
        type: joi.string()
            .required()
            .messages({
                "string.empty": "Card type is Required",
            }),
        _csrf: joi.string()
            .min(6)
            .required()
    });
    
    return newCardSchema.validate(data, {abortEarly: false});
}


// Exports
module.exports.registerValidation = registerValidation;                 // Registration (whole form)
module.exports.registerValidation1 = registerValidation1;               // Registration (subform 1)
module.exports.registerValidation2 = registerValidation2;               // Registration (subform 2)
module.exports.registerValidation3 = registerValidation3;               // Registration (subform 3)
module.exports.loginValidation = loginValidation;                       // Login
module.exports.newFacilityValidation = newFacilityValidation;           // Facility creation 
module.exports.newActivityValidation = newActivityValidation;           // Activity creation
module.exports.cashPaymentValidation = cashPaymentValidation;           // Cash Payment 
module.exports.apiLoginValidation = apiLoginValidation;                 // ApiLogin
module.exports.apiRegisterValidation = apiRegisterValidation;           // ApiRegister
module.exports.apiNewActivityValidation = apiNewActivityValidation;     // ApiNewActivity
module.exports.updateDetailsValidation = updateDetailsValidation;       // Update User Details
module.exports.updateAddressValidation = registerValidation3;           // Update address
module.exports.updatePasswordValidation = updatePasswordValidation;     // Update password
module.exports.newCardValidation = newCardValidation;                   // Add new card

