import { chatService } from "../repositories/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateMessageErrorInfo, mongoError } from "../services/errors/info.js";

class ChatController{
  
  sendMsg = async (req, res, next)=>{
    try{
      const { message } = req.body;
      const user = req.user.usrDTO.email;
      const newMsg = {
        user,
        message
      }
      if (Object.values(newMsg).every((value) => String(value).trim() !== "" && value !== undefined)){
        if (await chatService.createMsg(newMsg)) {
          res.send({ status: "success", payload: newMsg });
        } else {
          const err = new CustomError(
            "error de mongoDB",
            mongoError(),
            "error al enviar el mensaje a bdd",
            EErrors.DATABASE_ERROR
          )
          return next(err);
        }
      } else {
        const err = new CustomError(
          "faltan campos",
          generateMessageErrorInfo(newMsg),
          "error al crear el mensaje faltan campos obligatorios",
          EErrors.INVALID_TYPES_ERROR
        )
        return next(err);
      }
    } catch (error) {
      res.send({status: "error", message: "Error en ejecución, " + error});    
    }
  };

  readMsgs = async(req,res) =>{
    try {
      const messages = await chatService.getMsgs();
      res.send({ status: "success", payload: messages });
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };
  
}
export default ChatController;