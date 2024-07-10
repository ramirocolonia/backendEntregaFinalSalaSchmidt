import { Router } from "express";
import { passportCall } from "../utils.js";
import SessionController from "../controllers/session.controller.js";

const sessionsRouter = Router();
const {
  registerUser,
  login,
  logout,
  passRecoveryMail,
  resetPassToken,
  updatePass
} = new SessionController();

sessionsRouter.post("/register", registerUser);

sessionsRouter.post("/login", login);

sessionsRouter.get("/logout", passportCall("jwt", ["USER", "PREMIUM", "ADMIN"]), logout);

sessionsRouter.get("/current", passportCall("jwt", ["USER", "PREMIUM"]), async (req, res)=>{
  res.send(req.user);
});

sessionsRouter.post("/resetPass", passRecoveryMail);

sessionsRouter.get("/resetPass/:token", resetPassToken);

sessionsRouter.post("/newPass", updatePass);

export default sessionsRouter;