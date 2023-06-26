const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email id");
            }
        }
    },
    phone:{
        type:Number,
        required:true,
        min:10
    },
    password:{
        type:String,
        minLength:8
    },
    confirmpassword:{
        type:String,
        minLength:8
    },
    message:{
        type:String,
        required:true,
        minLength:1
    },
    date:{
        type:Date,
        default:Date.now
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

// Middelware for hashing the password
userSchema.pre("save", async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        console.log((this.password));
    }
    next();
})

// we need a collection 
const User = mongoose.model("User",userSchema);

module.exports = (User);
