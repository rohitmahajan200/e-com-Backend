import mongoose from "mongoose";

export const userSchema=new mongoose.Schema({
    name:String,
    email:{type:String, unique:true, match:[/.+\@.+\../,"Please enter a valid email"]},
    password:{type:String,required:true},
    type:{type:String, enum:["customer","seller"]}
});