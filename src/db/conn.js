const mongoose = require("mongoose");

// creating a database 
mongoose.connect("mongodb://127.0.0.1:27017/GurjashanDynamic",{
    // dbName: 'Gurjashandynamic',
    useUnifiedTopology:true,
    useCreateIndex:true,
    useNewUrlParser:true})
.then(() => {
    console.log(`Connected to database MongoDB`);
}).catch((error) => {
    console.log(error);
})