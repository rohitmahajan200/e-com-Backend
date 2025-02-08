import ApplicationError from "../../../errorHandling.js";
import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  postLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body; //extracting email and password from request body
      const user = await this.userRepository.findByEmail(email); //calling repository for login
      if (!user) {
        res.status(404).send("User does not exist");
      } else {
        console.log(user);
        
        const result = await bcrypt.compare(password, user.password);
        console.log(result);
        
        if (result) {
          const token = jwt.sign(
            {
              email: email,
              userID: user.id,
            }, //payload for token*
            "bgtwbcs7773efldcsdsDF[QY89", //the secret key
            { expiresIn: "1hr" } //setting expiry of token
          );
          res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
          });
          res.send(token);
        } else {
          res.status(401).send("Wrong password.");
        }
      }
    } catch (err) {
      res.status(500).send("Something went wrong"); 
    }
  };

  postSignUp = async (req, res) => {
    const { name, email, password, type } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new UserModel(name, email, hashedPassword, type); //calling model for registration
    await this.userRepository.signUp(user);
    res.status(201).send(user);
  };
}
