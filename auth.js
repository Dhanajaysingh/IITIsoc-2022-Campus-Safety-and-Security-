const e = require("express");
const jwt = require("jsonwebtoken");
const Signin = require("../models/signins");
const auth= async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        const user = await Signin.findOne({_id:verifyUser._id});
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.redirect('/login');
    }
}
module.exports = auth;