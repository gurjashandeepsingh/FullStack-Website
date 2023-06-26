require("dotenv").config();
const express = require("express");
const path = require("path");
const User = require("./models/UserCollection");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const app = express();
const cookieParser = require("cookie-parser");
const auth = require("../src/middleware.js/auth");
const port = process.env.PORT;
const generateAuthToken = require('./token.util')
require("./db/conn");

// setting the path 
const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");

// // middleware 
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static(staticpath))
app.set("view engine", "hbs");
app.set("views", templatepath);
hbs.registerPartials(partialpath);


// routing 
// app.get( path, callback )
app.get("/",(req,res)=>{
    res.render("index");
})

app.post("/contact", async(req, res) => {
    try {
        // res.send(req.body);
        const userData = new User(req.body);
        await userData.save();
        res.status(201).render("index");
    } catch (error) {
        res.status(400).send(error);
    }
})

// // Registration form 
app.post("/register", async (request,response) => {
    try{
    const password = request.body.password;
    const cpassword = request.body.confirmpassword;

    if(password===cpassword){
        const RegisterPerson = new User({
        name : request.body.name,
        email : request.body.email,
        phone : request.body.phone,
        password : request.body.password,
        confirmpassword : request.body.cpassword,
        message : request.body.message
        });
        console.log(`The code is working fine till ${RegisterPerson}`);
        const registration = await RegisterPerson.save();

        // Generate JSON Token
        const {tokens,token} = await generateAuthToken(registration._id, registration.tokens);
        registration.tokens = tokens
        // Generate and Save Cookies
        console.log('token',token) 
        response.cookie("jwt",token, {
            expires:new Date(Date.now() + 1200000),
            httpOnly:true
        });       

        const updatedRegistration = await registration.save();
        // response.send(`The code is working fine till ${RegisterPerson}`).status(200);
        response.status(202).render("registersuccess.hbs");
    }
    else{
        response.send(`Passwords are not matching`).status(401);
    }
}catch(error) { 
    console.log(error)
    response.send(`<h1>Something went wrong</h1>`);
}
})


// Login Page 
app.post("/login", async(request,response) => {
    try {
        const email_forLogin = request.body.email_login;
        const password_forLogin = request.body.password_login;
        const searchQuery = await User.findOne({email:email_forLogin}); 
        console.log(searchQuery.id);
        const isMatch = await bcrypt.compare(password_forLogin,searchQuery.password);
        if(isMatch){
            // Generate JWT Token 
            const {tokens,token} = await generateAuthToken(searchQuery._id, searchQuery.tokens);
            searchQuery.tokens = tokens
            await searchQuery.save()
            console.log(token);
            // Generate and save Cookies 
            response.cookie("jwt", token, {
                expires:new Date(Date.now() + 1200000),
                httpOnly:true
            });
            response.status(201).render("loginsuccess");
        }else{
            response.send(`Invalid Login Details, Please try again`);
        }
    }catch (error) {
        console.log(error);
        response.status(401).send(`Oops, something went wrong`);
    }
})

// Logout functionality 
app.get("/logout", auth, async(request,response) => {
    try {
        response.clearCookie();
        await request.user.save();
        console.log(request.user);
        response.render("index");
    } catch (error) {
        console.log(error);
        response.status(401).send(`Bad Request, please try again.`);
    }
})

// Secret page to test Cookies 
app.get("/secret", (request,response) => {
    console.log(request)
    console.log(`This is your jwt saved in cookie ${request.cookies.jwt}`);
    response.render("secret");
})
// server create  
app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
})