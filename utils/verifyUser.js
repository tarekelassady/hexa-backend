import jwt from "jsonwebtoken";

export const verifyToken=(req,res,next)=>{
    const token= req.cookies.access_token;
    if(!token) return res.json("You are not authenticated");

    jwt.verify(token,process.env.JWT_SECRET_KEY, (err,user)=>{
        if(err) return next(err);
        req.user=user;
        next();
    })
}

export const verifyUser=(req,res,next)=>{
    verifyToken(req,res,()=>{
        console.log(req.user.id,req.params.id,req.user.isAdmin);
        if(req.user.id===req.params.id || req.user.isAdmin){
            next();
        }else{
            return res.status(403).json("You are not authorized to make changes");
        }
    })
}

export const verifyAdmin=(req,res,next)=>{
    verifyToken(req,res,next,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            next(err);
        }
    })
}