import express from "express";
import Project from "../models/project.js"

const router=express.Router();

//Create Project
router.post("/", async(req,res,next)=>{
    const newProject=new Project(req.body);
    try{
        const addProject=await newProject.save();
        res.status(200).json(addProject);
    }catch(err){
        // res.status(500).json(err);
        next(err);
    }
})
//Update Project
router.put("/:id", async(req,res,next)=>{
    try{    
        const updateProject=await Project.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new: true});
        res.status(200).json(updateProject);
    }catch(err){
        next(err);
    }
})
//Delete Project
router.delete("/:id",async(req,res,next)=>{
    try{
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json("Project has been deleted");
    }catch(err){
        next(err);

    }
})
//Get Prject
router.get("/:id",async(req,res,next)=>{
    try{
        const getProject=await Project.findById(req.params.id);
        res.status(200).json(getProject);
    }catch(err){
        next(err);
    }
})
//Get All Projects
router.get("/",async(req,res,next)=>{
    try{
        const getAllProjects=await Project.find();
        res.status(200).json(getAllProjects);
    }catch(err){
        next(err);
    }
})
//Get # of Projects
router.get("/stats/countByCategory",async(req,res,next)=>{
    const queryList=req.query.category.split(",");
    try{
        const count=await Promise.all(queryList.map(cat=>{
            return Project.countDocuments({category:cat});
        }))
        res.status(200).json(count);
        
    }catch(err){
        next(err);
    }
})
export default router;