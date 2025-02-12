import { ObjectId } from "mongodb";
import ApplicationError from "../../../errorHandling.js";
import { getDB } from "../../config/mongodb.js";

export default class ProductRepository {
  async getAll() {
    try {
      const db = getDB();
      //2.getting the collection
      const collection = db.collection("products");
      return await collection.find().toArray();
    } catch (error) {
      throw ApplicationError("Something went wrong with DB", 500);
    }
  }

  async get(id) {
    try {
      const db = getDB();

      //2.getting the collection
      const collection = db.collection("products");
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new ApplicationError("Something went wrong with DB", 500);
    }
  }

  async add(newProduct) {
    try {
      const db = getDB();
      //2.getting the collection
      const collection = db.collection("products");
      await collection.insertOne(newProduct);
      return newProduct;
    } catch (error) {
      throw ApplicationError("Something went wrong with DB", 500);
    }
  }

  async filter(min, max, catagories) {
    try {
      const db = getDB();
      //2.getting the collection
      const collection = db.collection("products");
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
      return await collection
        .find(filterExpression)
        .project({ name: 1, price: 1, desc: 1, _id: 0, ratings: { $slice: 1 } })
        .toArray();
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
      const db = getDB();
      //2.getting the collection
      const collection = db.collection("products");

      await collection.updateOne(
        {
          _id: new ObjectId(productId),
        },
        {
          $pull: { ratings: { userID: new ObjectId(userID) } },
        }
      );

      await collection.updateOne(
        {
          _id: new ObjectId(productId),
        },
        {
          $push: { ratings: { userID: new ObjectId(userID), rating } },
        }
      );
    } catch (error) {
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
