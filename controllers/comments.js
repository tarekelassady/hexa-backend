import express from "express";
import Comment from "../models/comment.js";
import Project from "../models/project.js";
import { verifyUser,verifyAdmin } from "../utils/verifyUser.js";

const router=express.Router();
//Create Comment
router.post("/:projectId",verifyUser, async(req,res,next)=>{
    const newComment=new Comment({
            userId:req.body.userId,
            projectId:req.params.projectId,
            comment:req.body.comment,
        }
        );
    try{
        const addComment = await newComment.save();
        try{
            await Project.findByIdAndUpdate(req.params.projectId,
                {$push:{comments:addComment._id}});
        }catch(err){
            next(err);
        }
        res.status(200).json(addComment);
    }catch(err){
        next(err);
    }
})
//Update Comment
router.put("/:id",verifyUser,async(req,res,next)=>{
    try{
        const updateComment=await Comment.findByIdAndUpdate(req.params.id,
            {$set:req.body},
            {new:true});
            res.status(200).json(updateComment);
    }catch(err){
        next(err);
    }
})
//Delete Comment
router.delete("/:id/:projectId",verifyUser,async(req,res,next)=>{
    try{
        await Comment.findByIdAndDelete(req.params.id);
        try{
            await Project.findByIdAndUpdate(req.params.projectId,
                {$pull:{comments:req.params.id}})
        }catch(err){
            next(err);
        }
        res.status(200).json("The comment has been deleted successfully");
    }catch(err){
            next(err);
    }
})
//Get Comments for a specific projects
router.get("/:projectId",async(req,res,next)=>{
    try{
        const getComments=await Comment.find({projectId:req.params.projectId});
        res.status(200).json(getComments);
    }catch(err){
        next(err);
    }
})
//Get Comemnts
router.get("/",verifyAdmin,async(req,res,next)=>{
    try{
        const getAllComments=await Comment.find();
        res.status(200).json(getAllComments);
    }catch(err){
        next(err);
    }
    
})

export default router;