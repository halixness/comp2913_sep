/*
    auth.js
        -- token authentication functions
        
    Contributers
        -- Artyom Tiunelis
*/


// variable declarations
const jwt = require('jsonwebtoken');


/*
 *  Function:   Token authentication 
*/
function authenticate(req, res, next){
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send('Access Denied');
    }

    try{
        // success
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;

    // Error
    }catch(err){
        res.status(400).send('Invalid Token');
    }

}