const jwt = require("jsonwebtoken");
const User = require("../models/UserCollection");

const auth = async(request,response,next) => {
    try {
        console.log('requestrequestrequestrequestrequestrequestrequest',request)
        const token = request.cookies.jwt;
        const jwtAuthorization = jwt.verify(token, EncryptedKey);
        console.log(jwtAuthorization);
    } catch (error) {
        console.log(error);
        response.status(401).send(`Sorry, not Authorized!`);
    }
}


module.exports = auth