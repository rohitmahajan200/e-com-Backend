import CartModel from "./cart.model.js";

export default class CartController{

    static add=(req,res)=>{
        const{productId,quantity}=req.query;
        const userId=req.userId;
        const newItemm=CartModel.add(productId,quantity,userId);
        if(newItemm){
            res.status(201).send(newItemm);
        }
        else{
            res.status(400).send("Product does not exist")
        }
    }

    static delete=(req,res)=>{
        const {productId}=req.params
        const {userId}=req;
        const deletedItem=CartModel.delete(productId,userId);
        if(deletedItem){
            res.status(200).send(deletedItem);
        }
        else{
            res.status(400).send("Something went wrong")
        }
    }

    static getAll=(req,res)=>{
        const userId=req.userId;
        console.log("user id in get all ",userId);
        
        const userCart=CartModel.getAll(userId);
        if(userCart){
            res.status(200).send(userCart);
        }
        else{
            res.status(400).send("Cart is Empty")
        }
    }
}