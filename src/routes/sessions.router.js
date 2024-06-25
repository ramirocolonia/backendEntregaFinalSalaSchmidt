import { Router } from "express";
import { passportCall } from "../utils.js";
import SessionController from "../controllers/session.controller.js";

const sessionsRouter = Router();
const {
  registerUser,
  login,
  passRecoveryMail,
  resetPassToken,
  updatePass,
  updateUserRol
} = new SessionController();

sessionsRouter.post("/register", registerUser);
sessionsRouter.post("/login", login);
sessionsRouter.get("/api/sessions/current", passportCall("jwt", ["USER", "PREMIUM"]), async (req, res)=>{
  res.send(req.user);
});

sessionsRouter.post("/resetPass", passRecoveryMail);

sessionsRouter.get("/resetPass/:token", resetPassToken);

sessionsRouter.post("/newPass", updatePass);

sessionsRouter.post("/api/users/premium/:uid", passportCall("jwt", ["USER", "PREMIUM"]), updateUserRol);

export default sessionsRouter;