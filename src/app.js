require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const app = express();

require("./conn/connection");
const User = require("./models/user");

app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("hello world");
})

app.get("/secretpage", auth , (req,res)=>{
    res.status(200).send(`You are an authorized user ${req.username}`)
})

app.post("/signup", async (req,res)=>{

    try {
        const newUser = new User(req.body)
        const userPasswd = newUser.password;
        const userCPasswd = newUser.confirmpassword;

        if(userPasswd === userCPasswd){

            const token = await newUser.generateAuthToken();
            // await newUser.save();
            res.cookie("jwt",token,{
                expires : new Date(Date.now() + 180000),
                httpOnly:true
            })

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

    if(await bcrypt.compare(req.body.password , user.password )){
        const token = await user.generateAuthToken();
        res.cookie("jwt",token,{
            expires : new Date(Date.now() + 180000),
            httpOnly:true
        })
        res.status(200).send(user);
    }else{
        res.status(400).send("Invalid Credentials");
    }
})

app.post("/logout", auth , async (req,res)=>{

    const user = await User.findOne({_id:req.user._id})
    user.tokens = user.tokens.filter((token)=> token.token != req.cookies.jwt);

    res.status(200).send(req.user)
})



app.listen(3000, ()=>{
    console.log("server started at port 3000");
})