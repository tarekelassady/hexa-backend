import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyUser.js";

const router=express.Router();

//Create User (Register)
router.post("/register",async(req,res,next)=>{
    try{
        const salt=bcrypt.genSaltSync(10);
        const hash=bcrypt.hashSync(req.body.password,salt);
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:hash
        });
        await newUser.save();
        res.status(200).send("User has been registered successfully");
    }catch(err){
        next(err);
    }
})

//Login
router.get("/login",async(req,res,next)=>{
    try{
        const getUser=await User.findOne({username:req.body.username});
        if(!getUser) return res.status(404).json("User is not found");
        const isPasswordCorrect= await bcrypt.compare(req.body.password,getUser.password);
        if(!isPasswordCorrect) return res.status(400).json("Wrong username or password");
        //JWT
        console.log(getUser)
        const token= jwt.sign({id:getUser._id, isAdmin:getUser.isAdmin},process.env.JWT_SECRET_KEY);
        const {password,isAdmin,...otherDetails}=getUser._doc;
        res.cookie("access_token",token,{
            httpOnly:true,
        }).status(200).json({...otherDetails});
    }catch(err){
        next(err);
    }
})

// //Verify User
// router.get("/verifyuser",verifyToken,(req,res,next)=>{
//     res.send("Hello user, you are logged in");
// })

//Update User
router.put("/:id",verifyUser,async(req,res,next)=>{
    try{
        const salt=bcrypt.genSaltSync(10);
        const hash=req.body.password && bcrypt.hashSync(req.body.password,salt);
        const {password,...otherDetails}=req.body;
        const updateUser=await User.findByIdAndUpdate(
            req.params.id,
            {$set:{password:hash,...otherDetails}},
            {new:true});
        res.status(200).json(updateUser);
    }catch(err){
        next(err);
    }
})

//Delete User
router.delete("/:id",verifyUser,async(req,res,next)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("The user has been deleted");
    }catch(err){
        next(err);
    }
})

//Get User
router.get("/:id",verifyUser,async(req,res,next)=>{
    try{
        const getUser=await User.findById(req.params.id);
        res.status(200).json(getUser);
    }catch(err){
        next(err);
    }
})
//Get All Users
router.get("/",verifyAdmin,async(req,res,next)=>{
    try{
        const getAllUsers=await User.find();
        res.status(200).json(getAllUsers);
    }catch(err){
        next(err);
    }
})
export default router;