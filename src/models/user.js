require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
});

userSchema.methods.generateAuthToken = async function(){

    try {
            
        const token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token});

        await this.save();
        return token;

    } catch (e) {
        return e;
    }


}

userSchema.pre("save", async function(next){

    try {
        const encrypt = await bcrypt.hash(this.password,10);
        this.password = encrypt;
        this.confirmpassword = encrypt;
    
        next();
    } catch (e) {
        console.log(e);
        // next();
    }


});


const User = new mongoose.model("User",userSchema);



module.exports = User;