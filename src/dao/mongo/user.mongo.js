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

  async findOneUser(query){
    const result = await userModel.findOne(query);
    return result;
  }
  
  async updateUser(uId, newValues) {
    const result = await userModel.updateOne({ _id: uId }, newValues);
    return result; 
  }

  async findUsers(query){
    const result = await userModel.find(query);
    return result;
  }

  async updateManyUsers(filter, update) {
    const result = await userModel.updateMany(filter, {$set: update});
    return result; 
  }
  
}

export default UserMongo;