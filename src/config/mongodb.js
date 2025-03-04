import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
//import mongoose from 'mongoose';
dotenv.config();
const url=process.env.DB_URL;
console.log(url);

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
export const getClient=()=>{
    return client;
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




//   C:\Program Files\MongoDB\Server\8.0\data>  path in windows
// mongod --replSet rs0 --dbpath "C:\data\db" --bind_ip 127.0.0.1:27017
// for relpica set   mongod --replSet rs0--dbpath="C:\data\db"


///imp