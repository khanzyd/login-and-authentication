const express = require("express");
const app = express();

require("./conn/connection");
const User = require("./models/user");

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("hello world");
})

app.post("/signup", async (req,res)=>{

    try {
        const newUser = new User(req.body)
        const userPasswd = newUser.password;
        const userCPasswd = newUser.confirmpassword;

        if(userPasswd === userCPasswd){
           await newUser.save();
           res.status(201).send(`New user created successfully : ${newUser}`)
        } else {
            res.status(400).send("Password and confirm Password does not match. Cannot create User.")
        }

    } catch (e) {
        console.log(e);
        return res.status(400).send("Cannot save data")
    }

})


app.post("/login", async (req,res)=>{
    const user = await User.findOne({username:req.body.username});

    if(user){
        res.status(200).send(user);
    }else{
        res.status(400).send("user does not exist");
    }
})



app.listen(3000, ()=>{
    console.log("server started at port 3000");
})