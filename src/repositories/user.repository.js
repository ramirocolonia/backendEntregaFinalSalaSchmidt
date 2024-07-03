export default class UserRepository{
  constructor(dao){
    this.dao = dao;
  }

  createUser = async(user) =>{
    const result = await this.dao.createUser(user);
    return result;
  }

  existEmail = async(uEmail) =>{
    if (await this.dao.existEmail(uEmail)) {
      return true;
    }
    return false;
  }

  findOneUser = async(query) =>{
    const result = await this.dao.findOneUser(query);
    return result;
  }

  updateUser = async(uId, newValues) =>{
    const result = await this.dao.updateUser(uId, newValues);
    return result; 
  }

  findUsers = async(query) =>{
    const result = await this.dao.findUsers(query);
    return result; 
  }

  updateManyUsers = async(filter, update) =>{
    const result = await this.dao.updateManyUsers(filter, update);
    return result; 
  }
}