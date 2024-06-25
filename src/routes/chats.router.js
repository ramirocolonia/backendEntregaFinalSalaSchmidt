import { Router } from "express";
import ChatController from "../controllers/chat.controller.js";
import { passportCall } from "../utils.js";

const chatsRouter = Router();
const {
  sendMsg,
  readMsgs
} = new ChatController();

chatsRouter.post("/api/chat", passportCall("jwt", ["USER"]), sendMsg);
chatsRouter.get("/api/chat", readMsgs);

export default chatsRouter;