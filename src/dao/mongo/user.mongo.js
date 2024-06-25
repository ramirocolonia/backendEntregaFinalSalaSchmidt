import { cartModel } from "../models/cart.model.js";
import { userModel } from "../models/user.model.js";

class UserMongo{

  async createUser(user){
    const cart = await cartModel.create({});
    user.cart = cart;
    const result = await userModel.create(user);
    
    return result;
  }

  async existEmail(uEmail) {
    if (await userModel.findOne({ email: uEmail })) {
      return true;
    }
    return false;
  }

  async findOneUser(uEmail){
    const result = await userModel.findOne({ email: uEmail });
    return result;
  }
  
  async updateUser(uId, newValues) {
    const result = await userModel.updateOne({ _id: uId}, newValues);
    return result; 
  }
}

export default UserMongo;