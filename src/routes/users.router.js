import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { passportCall } from "../utils.js";


const usersRouter = Router();
const {
  loadUsers, 
  deleteInactiveUsers, 
  updateUserRol,
  deleteUser,
  uploadFiles
} = new UserController();

usersRouter.post("/premium/:uid", passportCall("jwt", ["ADMIN"]), updateUserRol);

usersRouter.post("/:uid/documents", uploadFiles);

usersRouter.get("/", passportCall("jwt", ["ADMIN"]), loadUsers);

usersRouter.delete("/", passportCall("jwt", ["ADMIN"]), deleteInactiveUsers);

usersRouter.delete("/:uid", passportCall("jwt", ["ADMIN"]), deleteUser);



export default usersRouter;