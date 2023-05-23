import mongoose from 'mongoose';

const projectSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    img:{
        type:String,
        
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        required:false
    },
    featured:{
        type:Boolean,
        default:false
    },
    tech:{
        type:[String],
        required:false
    },
    comments:{
        type:[String],
        required:false
    }
})

export default mongoose.model("Project",projectSchema)