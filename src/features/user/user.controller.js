import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
export default class UserController {

  postLogin = (req, res) => {
    const { email, password } = req.boody; //extracting email and password from request body
      const user=UserModel.login(email, password); //calling model for login
      const token = jwt.sign(
        { 
          email: email,
          userID: user.id
         }, //payload for token*
        "bgtwbcs7773efldcsdsDF[QY89",//the secret key
        { expiresIn: "1hr" } //setting expiry of token
      );
      res.send(token); //sending token to client
    }
  

  
  postSignUp = (req, res) => {
    const { name, email, password } = req.body;
      const user = UserModel.signUp(name, email, password); //calling model for registration
  };

}
