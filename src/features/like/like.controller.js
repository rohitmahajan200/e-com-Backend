import { LikeRepository } from "./like.repository.js";

export class LikeController {
    constructor(){
        this.likeRepo=new LikeRepository();
    }
  async likeItem(req, res, next) {
    try {
        const {id,type}=req.body;
        const userId=req.userId;
        if(type!='products' && type!='categories'){
            return res.status(400).send("Invalid Type.")
        }
        if(type=='products'){
            this.likeRepo.likeProduct(userId,id);
            res.status(201).send("You like the product!")
        }
        else{
            this.likeRepo.likeCategory(userId,id);
            res.status(201).send("You like the category!")
        }
    } catch (error) {
      res.status(500).send("Something went wrong.");
    }
  }

  async getLikes(req,res){
    try {
        const {id,type}=req.body;
        const like=await this.likeRepo.getLikes(type,id);
        res.status(200).send(like);
    } catch (error) {
      console.log(error);
      
        res.status(500).send("Something went wrong."); 
    }
  }


  async getUsersLikes(req,res){
    try {
        const {userId}=req;
        const {type}=req.body;
        const like=await this.likeRepo.getUsersLikes(userId,type);
        console.log(like);
        
        res.status(200).send(like);
    } catch (error) {
      console.log(error);
        res.status(500).send("Something went wrong."); 
    }
  }

}



