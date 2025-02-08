import ApplicationError from "../../../errorHandling.js";
import { getDB } from "../../config/mongodb.js";
export default class UserRepository{
    async signUp(newUser) {    
        try {
        //1.getting the data base
        const db=getDB();
        //2.getting the collection
        const collection=db.collection('users');
        //3.Insert the document
        await collection.insertOne(newUser)
        return newUser
        } 
        catch (err){
          throw new ApplicationError("Something went wrong with DB")
        }
      }

    
      async findByEmail(email) {
            try {
            //1.getting the data base
            const db=getDB();
            //2.getting the collection
            const collection=db.collection('users');
            //3.manual validation of user
            return await collection.findOne({email})
            } catch (err) {
              throw new ApplicationError("Somethig went wrong with DB",500);
            }
        
          }
}