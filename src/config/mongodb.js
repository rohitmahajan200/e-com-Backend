import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();
const url=process.env.DB_URL;

let client;
export const connectDB=()=>{
     MongoClient.connect(url)
    .then(clientInstance=>{
        client=clientInstance;
        console.log("MongoDB is connected!"); 
        createCounter(client.db())
        createIndexs(client.db())
    })
    .catch(err=>{
        console.log("Error is==>",err);
    })
}

export const getDB=()=>{
    return client.db()
}

const createCounter=async(db)=>{
    const existingCounter=await db.collection("counters").findOne({_id:"cartItemId"});
    if(!existingCounter){
        await db.collection("counters").insertOne({_id:"cartItemId",value:0});
    }
}

const createIndexs=async(db)=>{
    try {
        await db.collection("products").createIndex({price:1});
        await db.collection("products").createIndex({name:1,catagory:-1});
        await db.collection("products").createIndex({desc:"text"});
        console.log("Index's are created"); 
    } catch (error) {
        console.log(error);
        
    }
    
    
}