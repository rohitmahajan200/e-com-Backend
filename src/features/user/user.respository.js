import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import ApplicationError from "../../../errorHandling.js";

//creating model from schema
const UserModel = mongoose.model("users", userSchema);

export default class UserRepository {
  async signup(user) {
    try {
      //creating instance of model
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (error) {
      if(error instanceof mongoose.Error.ValidationError){
        throw error;
      }
      else{
        console.log(error);
        throw new ApplicationError("Something went wrong with databse", 500);
      }
    }
  }

  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      throw new ApplicationError("Somethig went wrong with databse", 500);
    }
  }

  async resetPassword(userId,newPassword){
    console.log("user in user repo ",userId);
    try {
        const user=await UserModel.findById(userId);

        if(user){
            user.password=newPassword;
            user.save(); //sae is updating here
        }
        else{
            throw new ApplicationError("User not found.", 404);
        }

    } catch (error) {
        throw new ApplicationError("Something went wrong while updating the password.", 500);
    }
  }
}
