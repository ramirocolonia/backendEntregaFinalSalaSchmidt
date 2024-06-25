import { Router } from "express";
import { passportCall } from "../utils.js";
import UserController from "../controllers/user.controller.js";

const usersRouter = Router();
const {
  registerUser,
  login,
  passRecoveryMail,
  resetPassToken,
  updatePass,
  updateUserRol
} = new UserController();

usersRouter.post("/register", registerUser);
usersRouter.post("/login", login);
usersRouter.get("/api/sessions/current", passportCall("jwt", ["USER", "PREMIUM"]), async (req, res)=>{
  res.send(req.user);
});

usersRouter.post("/resetPass", passRecoveryMail);

usersRouter.get("/resetPass/:token", resetPassToken);

usersRouter.post("/newPass", updatePass);

usersRouter.post("/api/users/premium/:uid", passportCall("jwt", ["USER", "PREMIUM"]), updateUserRol);

export default usersRouter;