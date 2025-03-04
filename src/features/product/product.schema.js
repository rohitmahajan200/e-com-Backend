import mongoose from "mongoose";
export const productSchema=new mongoose.Schema({
    name:String,
    desc:String,
    price:Number,
    imgUrl:String,
    sizes:{type:[String],enum:['S','M','L','X','XL','XXL']},
    stock:Number,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }],
    category:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'catagories'
    }]
})