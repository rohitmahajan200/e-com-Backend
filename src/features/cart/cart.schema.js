import mongoose from "mongoose";
import productId from "mongodb"
const cartSchema=new mongoose.Schema({
    productId:{type:mongoose.Schema.Types.ObjectId,ref:'products'},
    quantity:Number,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'users'}
})