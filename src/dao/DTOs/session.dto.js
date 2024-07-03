export default class SessionDTO{
  constructor (user){
    this.full_name = user.first_name + " " + user.last_name,
    this.age = user.age,
    this.email = user.email,
    this.rol = user.rol,
    this.cart = user.cart._id
  }
}