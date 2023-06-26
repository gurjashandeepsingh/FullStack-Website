const jwt = require("jsonwebtoken");


//Generating JSON Web Token 
const generateAuthToken = async function(id,tokens){
    try{
        console.log(id);
        const token = jwt.sign({id:id.toString()}, process.env.EncryptedKey);
        tokens = tokens.concat({token:token});
        console.log(token);
        console.log(tokens)
        return {tokens, token}
    } catch (error) {
        console.log('error: ',error);
        throw new Error('There was an error in generating the jwt token')
    }
}

module.exports = (generateAuthToken)