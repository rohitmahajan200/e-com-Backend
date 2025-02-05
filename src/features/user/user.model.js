import ApplicationError from "../../../errorHandling.js";
export default class UserModel {
  constructor(name, email, password,id) {
    (this.name = name), (this.email = email), (this.password = password),(this.id=id);
  }

  static login(email, password) {
    const user = users.find((u) => u.email == email && u.password == password);
    if(!user){
      throw new ApplicationError("Wrong Credentials",404);
    }
    else{
      return user;
    }
  }

  static signUp(name, email, password) {    
    if(!name.charAt(2) || !email.charAt(2) || !password.charAt(2)){
      throw new ApplicationError("Provide all details",400);
    }
    const id=users.length+1;
    const newUser = new UserModel(name, email, password,id);
    users.push(newUser);
    return newUser;
  }

  static getAll() {
    return users;
  }
}

export const users = [
  new UserModel("rohit m", "rm@gmail.com", "123",1),
  new UserModel("monika m", "mm@gmail.com", "321",2),
];
