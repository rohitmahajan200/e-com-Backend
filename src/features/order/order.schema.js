import mongoose from "mongoose";

export const productSchema= new mongoose.Schema({
        userId:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
        totalAmout:Number,
        timeStamp: { type: Date, default: Date.now }
});