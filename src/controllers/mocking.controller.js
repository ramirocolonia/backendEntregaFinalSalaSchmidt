import { generateProducts } from "../utils.js";

class MockingController{
  loadMocking = (req, res) => {
    try {
      const products = generateProducts(100);
      res.json({ status: "success", payload: products });
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución de función generate products con faker, " + error });
    }
  };

  loggerTest = (req, res) => {
    req.logger.fatal("este es un msj de nivel FATAL");
    req.logger.error("este es un msj de nivel ERROR");
    req.logger.warning("este es un msj de nivel WARNING");
    req.logger.info("este es un msj de nivel INFO");
    req.logger.http("este es un msj de nivel HTTP");
    req.logger.debug("este es un msj de nivel DEBUG");
    
    res.send("Logger implementado!")
  };
}

export default MockingController;