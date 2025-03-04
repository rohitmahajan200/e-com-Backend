import ApplicationError from "../../../errorHandling.js";
import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.respository.js";
import bcrypt from "bcrypt";
export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  postLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body; //extracting email and password from request body
      const user = await this.userRepository.findByEmail(email); //calling repository for login
      console.log(user);
      if (!user) {
        res.status(404).send("User does not exist");
      } else {
        const result = await bcrypt.compare(password, user.password);
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userID: user._id,
            }, //payload for token*
            "bgtwbcs7773efldcsdsDF[QY89", //the secret key
            { expiresIn: "1hr" } //setting expiry of token
          );
          res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
          });
          res.send(token);
        } 
        else {
          res.status(401).send("Wrong password.");
        }
      }
    } catch (err) {
      res.status(500).send("Something went wrong");
    }
  };

  postSignUp = async (req, res, next) => {
    const { name, email, password, type } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new UserModel(name, email, hashedPassword, type); //calling model for registration
    try {
      await this.userRepository.signup(user);
      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  
  };

  resetPassword=async(req,res)=>{
    const {newPassword}=req.body;
    const userId=req.userId;
    const hashedPassword=await bcrypt.hash(newPassword,12);
    try {
      await this.userRepository.resetPassword(userId,hashedPassword);
      res.status(201).send("Password changed successfully")
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong");
    }
  }
}
