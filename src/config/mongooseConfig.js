import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.schema.js";

dotenv.config();
const url=process.env.DB_URL;
console.log(url);

export const connectUsingMongoose=async()=>{
    try {
        await mongoose.connect(url);
        console.log("MongoDB is connected using mongoose");
        await addCatagories();
    } catch (error) {
        console.log(error);
    }
}

async function addCatagories(){
    const catagoryModel=mongoose.model('categories',categorySchema);
    const catagory=await catagoryModel.find();    
    if(!catagory || catagory.length==0){
        await catagoryModel.insertMany([{name:"books"},{name:'clothing'},{name:'electronics'}]);
    }
    console.log("Catagories are added.");
}