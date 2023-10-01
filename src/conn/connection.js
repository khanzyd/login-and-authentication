const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/users")
.then(()=>{
    console.log("connected to database")
}).catch((e)=>{
    console.log("error" + e);
});