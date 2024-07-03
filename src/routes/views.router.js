import {Router} from "express";

import { passportCall } from "../utils.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import { userService } from "../repositories/index.js";

const viewsRouter = Router();

viewsRouter.get("/chat", passportCall("jwt", ["USER"]), (req,res)=>{
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

export default viewsRouter;