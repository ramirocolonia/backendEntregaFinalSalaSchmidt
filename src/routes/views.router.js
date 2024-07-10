import {Router} from "express";

import { passportCall } from "../utils.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import { cartService, userService } from "../repositories/index.js";
import ProductController from "../controllers/product.controller.js";

const viewsRouter = Router();

viewsRouter.get("/chat", passportCall("jwt", ["USER", "PREMIUM"]), (req,res)=>{
  res.render("chat", {})
});

viewsRouter.get("/register", (req,res)=>{
  res.render("registerUser", {});
});

viewsRouter.get("/login", (req,res)=>{
    res.render("login", {});
});

viewsRouter.get("/", (req, res)=>{
  res.redirect("/login")
});

viewsRouter.get("/resetpass", (req,res)=>{
  res.render("resetPass", {});
});

viewsRouter.get("/userslist", passportCall("jwt", ["ADMIN"]), async(req, res) =>{
  try {
    const result = await userService.findUsers({ is_active: true });
    const users = result.map((user) => new UserDTO(user));
    res.render("usersList", { users });  
  } catch (error) {
    res.send({ status: "error", message: "Error en ejecución, " + error });
  }
});

viewsRouter.get("/products", passportCall("jwt", ["USER", "PREMIUM"]), async (req,res)=>{
  try {
    const productController = new ProductController();
    const resp = await productController.loadProducts(req,res);
    resp.payload.prevLink = resp.payload.hasPrevPage?`http://localhost:8080/products?page=${resp.payload.prevPage}&limit=${resp.payload.limit}`:"";
    resp.payload.nextLink = resp.payload.hasNextPage?`http://localhost:8080/products?page=${resp.payload.nextPage}&limit=${resp.payload.limit}`:"";
    resp.payload.isValid = (resp.payload.docs.length > 0);
    resp.payload.user = req.user.usrDTO.email;
    resp.payload.rol = req.user.usrDTO.rol;
    resp.payload.cid = req.user.usrDTO.cart;
    res.render("products", resp.payload);
  } catch (error) {
    res.send({status: "error", message: "Error en ejecución, " + error});
  }
});

viewsRouter.get("/cart/:cid", passportCall("jwt", ["USER", "PREMIUM"]), async (req,res)=>{
  try {
    const cart = await cartService.findOneCart(req.params.cid);
    if(cart){
      res.render("cartList", {
        cid: cart._id, 
        products: cart.products.map(prod => prod.toObject()), 
        total: cart.products.reduce((total, product) => total + (product.quantity * product.product.price),0)
      });
    }
  } catch (error) {
    res.send({status: "error", message: "Error en ejecución, " + error});
  }
});

viewsRouter.get("/documents", passportCall("jwt", ["USER", "PREMIUM"]), async(req, res) =>{
  const email = req.user.usrDTO.email;
  const user = await userService.findOneUser({ email: email });
  res.render("documents", {uid: user._id, user: user.email});
});

export default viewsRouter;