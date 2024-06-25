import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) =>{
  console.error("ERROR, " + error.cause);
  switch (error.code) {
    case EErrors.ALREADY_EXIST:
      res.status(404).send({status: "error", error: error.name, message: error.message})
      break;
    case EErrors.INVALID_TYPES_ERROR:
      res.status(404).send({status: "error", error: error.name, message: error.message});
      break;
    case EErrors.DATABASE_ERROR:
      res.status(404).send({status: "error", error: error.name, message: error.message});
      break;
    case EErrors.ROUTING_ERROR:
      res.status(404).send({status: "error", error: error.name, message: error.message})
      break;
    default:
      console.log("Error no desarollado")
      break;
  }
}