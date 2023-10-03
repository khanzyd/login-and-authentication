require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
// const cookieParser = require("cookie-parser");'



const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
    
        const user = await User.findOne({_id:verifiedUser._id})
        req.username = user.username;
        req.user = user;
        next()
    } catch (error) {
        console.log(error);
        res.status(400).send("Unauthorized user");
    }
}

module.exports = auth;