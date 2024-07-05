import { Router } from "express";
import ChatController from "../controllers/chat.controller.js";
import { passportCall } from "../utils.js";

const chatsRouter = Router();
const {
  sendMsg,
  readMsgs
} = new ChatController();

chatsRouter.post("/", passportCall("jwt", ["USER", "PREMIUM"]), sendMsg);
chatsRouter.get("/", readMsgs);

export default chatsRouter;