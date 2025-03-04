import { ObjectId } from "mongodb";
import ApplicationError from "../../../errorHandling.js";
import { getDB } from "../../config/mongodb.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./reviews.schema.js";
import { categorySchema } from "./category.schema.js";
const ProductModel = mongoose.model("products", productSchema);
const reviewModel=mongoose.model("reviews",reviewSchema);
const categoryModel=mongoose.model("categories",categorySchema);
export default class ProductRepository {
  async getAll() {
    try {
      return await ProductModel.find({});
    } catch (error) {
      throw new ApplicationError("Something went wrong with DB", 500);
    }
  }

  async get(id) {
    try {
      return await ProductModel.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new ApplicationError("Something went wrong with DB", 500);
    }
  }

  async add(newProduct) {
    try {
      //1.Add the product
      const newproduct = new ProductModel(newProduct);
      const savedProduct=await newproduct.save();

      //2.Update the categories
      await categoryModel.updateMany(
        {_id:{$in:savedProduct.category}},
        {products:new ObjectId(savedProduct._id)}
      );
      
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with DB", 500);
    }
  }

  async filter(min, max, catagories) {
    try {
      //const db = getDB();
      //2.getting the collection
      //const collection = db.collection("products");
      //{price:{$gte:min,$lte:max}},
      let filterExpression = {};
      if (min) {
        filterExpression.price = { $gte: parseFloat(min) };
      }
      if (max) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(max),
        };
      }

      if (catagories) {
        catagories = JSON.parse(catagories.replace(/'/g, '"'));
        filterExpression = {
          $and: [{ catagory: { $in: catagories } }, filterExpression],
        };
      }
      return await ProductModel.find(filterExpression).select(
        "name price desc ratings"
      );
    } catch (error) {
      console.log(error);

      throw new Error("Something went wrong with DB");
    }
  }

  // async rate(userID, productId, rating){
  //   try {
  //       const db = getDB();
  //       //2.getting the collection
  //       const collection = db.collection("products");

  //       const product=await collection.findOne({_id:new ObjectId(productId)});
  //       console.log("productRating found:-",product);
  //       const userRating=product?.ratings?.find(r=>r.userID==userID);
  //       console.log("userRating found:-",userRating);
  //       if(userRating){
  //         await collection.updateOne({_id:new ObjectId(productId),"ratings.userID": new ObjectId(userID)},{
  //           $set:{"ratings.$.rating":rating}
  //         })
  //       }
  //       else{
  //         await collection.updateOne({
  //           _id:new ObjectId(productId)
  //       },{
  //           $push:{ratings:{userID:new ObjectId(userID),rating}}
  //       })
  //       }
  //   } catch(error) {
  //       throw new ApplicationError("Something went wrong with DB",500)

  //   }
  // }

  async rate(userID, productId, rating) {
    try {
      // Check if the product exists
      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      // First, try to update an existing rating
      const userReview = await reviewModel.findOne(
        { product:new ObjectId(productId), user: new ObjectId(userID) }, // Find the existing rating
      );
      if(userReview){
        userReview.rating=rating;
        console.log("user review=>",userReview);
        await userReview.save();
        product.reviews.push(userReview._id)
        await product.save();
      }
      else{
        const newReview=new reviewModel({
          product:new ObjectId(productId),
          user: new ObjectId(userID),
          rating 
        });
        console.log("new review=>",newReview);
        
        await newReview.save();
        product.reviews.push(newReview._id)
        await product.save();
      }

    } catch (error) {
      console.log("Error in rating function:", error);
      throw new ApplicationError("Something went wrong with DB", 500);
    }
  }
  
  async average_Price_Per_Catagory() {
    try {
      const db = getDB();
      return await db
        .collection("products")
        .aggregate([
          {
            //1.Get average price as per catagory
            $group: {
              _id: "$catagory",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (error) {
      throw new ApplicationError("somethi went wrong wit DB", 500);
    }
  }

  async average_Rating() {
    const db = getDB();
    return db
      .collection("products")
      .aggregate([
        // {
        //   $unwind:"$ratings"
        // },
        // {
        //   $group:{
        //     _id:"$name",
        //     averageRating:{$avg:"$ratings.rating"},
        //     numberOfRatings:{$sum:1}
        //   }
        // },
        {
          $project: {
            _id: 0,
            name: 1,
            averageRating: { $avg: "$ratings.rating" },
            numberOfRatings: {
              $cond: {
                if: { $isArray: "$ratings" },
                then: { $size: "$ratings" },
                else: 0,
              },
            },
          },
        },
        {
          $sort: {
            averageRating: -1,
          },
        },
        // {
        //   //Limit to just one item
        //   $limit:1
        // }
      ])
      .toArray();
  }
}
