const mongoose = require("mongoose");

// creating a database 
mongoose.connect("mongodb://127.0.0.1:27017/thapadynamic")
.then(() => {
    console.log("connection successful");
}).catch((error) => {
    console.log(error);
})