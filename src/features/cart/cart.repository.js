import { ObjectId } from "mongodb";
import ApplicationError from "../../../errorHandling.js";
import { getDB } from "../../config/mongodb.js";
export default class CartRepository {
  constructor() {
    this.collection = "cart";
  }
  async add(productID, quantity, userID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const productId=new ObjectId(productID)
      const userId=new ObjectId(userID)
      const id=await this.insertId(db);
      await collection.updateOne(
        {userId,productId},
        { 
          $setOnInsert:{_id:id},
          $inc:{'quantity':quantity}
        },
        {upsert:true}
        )
      
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database.",500);
    }
  }

  async get(userID){
    try {
        const db = getDB();
        const collection = db.collection(this.collection);
        const userId=new ObjectId(userID)
        const cartItems=await collection.find({userId}).toArray();
        return cartItems;
      } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with database.");
      }
  }

  async delete(productId, userId){
    try {
      const db = getDB();
      const collection = db.collection(this.collection);      
      const result=await collection.deleteOne({userId:new ObjectId(userId),productId:new ObjectId(productId)});
      return result.deletedCount;
      
    } catch (error) {
        throw new ApplicationError("Something went wrong with database.");
    }
  }

  async insertId(db){
    const itemId=await db.collection("counters").findOneAndUpdate(
      {_id:"cartItemId"},
      {$inc:{value:1}},
      {returnDocument:'after'}
    );
    return itemId.value;
  }
}
