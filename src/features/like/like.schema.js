import mongoose from "mongoose";

export const likeSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    likeable:{type:mongoose.Schema.Types.ObjectId, refPath:'types'},
    types:{
        type:String,
        enum:['products','categories']
    }
}).pre('save',(next)=>{
   console.log("new like coming in");   
   next();
}).post('save',(doc)=>{
     console.log("Like is saved.");
     console.log(doc);
})