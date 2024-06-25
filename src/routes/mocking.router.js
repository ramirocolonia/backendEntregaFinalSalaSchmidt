import { Router } from "express";

import MockingController from "../controllers/mocking.controller.js";
import { addLogger } from "../utils/logger.js";

const mockingRouter = Router();
const { loadMocking, loggerTest } = new MockingController();

mockingRouter.get("/mockingproducts", loadMocking);
mockingRouter.get("/loggerTest", addLogger, loggerTest);


export default mockingRouter;