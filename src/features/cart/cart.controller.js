import CartModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";
export default class CartController {
  constructor() {
    this.cartRepo = new CartRepository();
  }
  async add(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.userId;
      await this.cartRepo.add(productId, quantity, userId);
      res.status(201).send("Cart is updated");
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong.");
    }
  }

  async delete(req, res) {
    try {
      const { productId } = req.body;
      const { userId } = req;      
      const result=await this.cartRepo.delete(productId, userId);
      if(result>0){
        res.status(200).send(`${result} item's are deleted`);
      }
      else{
        res.status(404).send("Cart is empty");
      }      
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
  }

  async get(req,res){
    try {
        const { userId } = req;      
        const cartItems=await this.cartRepo.get(userId);
        if(cartItems){
        res.status(200).send(cartItems);
        }
        else{
        res.status(404).send("Cart is empty");
        }
      } catch (error) {
        res.status(500).send("Something went wrong");
      }
    }
  }

