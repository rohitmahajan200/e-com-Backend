import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";
import ApplicationError from "../../../errorHandling.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    const client = getClient();
    const session = client.startSession();
    try {
      const db = getDB();
      session.startTransaction();
      //1.get cart item and calculate total amount
      const items = await this.getTotalAmount(userId);
      const finalTotalAmout = items.reduce((acc, cartItem) => acc + cartItem.totalAmout,0);

      //2.create an order record
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmout,
        new Date().toString()
      );
      await db.collection(this.collection).insertOne(newOrder);
      //await db.collection(this.collection).insertOne(newOrder, { session });

      //3.reduce the stock
      for (let item of items) {
        console.log("item is=>",item);
        
        await db
          .collection("products")
          .updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } });
      }
      //throw new Error("something went wrongorder not placed")
      //4.clear the cart item
      //db.collection("cart").deleteMany({ userId: new ObjectId(userId) },{session});
      await db.collection("cart").deleteMany({ userId: new ObjectId(userId) });
      //session.commitTransaction();
      //session.endSession();
      return;
    } catch (error) {
      console.log(error);
      //session.abortTransaction();
      //session.endSession();
      throw new ApplicationError(
        "Something went wrong while placing orders",
        500
      );
    }
  }

  async getTotalAmount(userId) {
    const db = getDB();
    const item = await db
      .collection("cart")
      .aggregate(
        [
          //1. get cart items of user
          {
            $match: { userId: new ObjectId(userId) },
          },
          //2. get the product from product collection
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          //3. unwind the product info
          {
            $unwind: "$productInfo",
          },
          //4. calculate total amount for each cart item
          {
            $addFields: {
              totalAmout: {
                $multiply: ["$productInfo.price", "$quantity"],
              },
            },
          },
        ],
      )
      .toArray();
    return item; 
  }
}
