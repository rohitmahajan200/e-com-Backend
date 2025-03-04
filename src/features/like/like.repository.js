import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { likeSchema } from "./like.schema.js"; 
import ApplicationError from "../../../errorHandling.js";
const likeModel=mongoose.model('likes',likeSchema);
export class LikeRepository{

    async likeProduct(userId,productId){
        try{
            const newLike=new likeModel({
                user:new ObjectId(userId),
                likeable:new ObjectId(productId),
                types:'products'
            })
            await newLike.save();
        }catch(error){
            console.log(error);   
            throw new ApplicationError("Something went wrong with database.",500)
        }
      
    }

    async likeCategory(userId,catagoryId){
        try{
            const newLike=new likeModel({
                user:new ObjectId(userId),
                likeable:new ObjectId(catagoryId),
                types:'categories'
            })
            await newLike.save();
        }catch(error){
            throw new ApplicationError("Something went wrong with database.",500)
        }
    }

    async getLikes(type,id){
        return likeModel.find({
            likeable:new ObjectId(id),
            types:type
        }).populate('user').populate({ path:'likeable',model:type});
    }

    async getUsersLikes(userId,type){
        return likeModel.find({
            user:new ObjectId(userId)
        }).populate({path:'likeable',model:type})
    }
}