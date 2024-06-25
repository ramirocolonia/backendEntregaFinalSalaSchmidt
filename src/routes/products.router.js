import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import { passportCall } from "../utils.js";

const productsRouter = Router();
const {
  loadProducts,
  loadProduct,
  newProduct,
  updateProduct,
  deleteProduct
} = new ProductController();

productsRouter.get("/", loadProducts);
productsRouter.get("/:pid", loadProduct);
productsRouter.post("/", passportCall("jwt", ["ADMIN", "PREMIUM"]), newProduct);
productsRouter.put("/:pid", passportCall("jwt", ["ADMIN", "PREMIUM"]), updateProduct);
productsRouter.delete("/:pid", passportCall("jwt", ["ADMIN", "PREMIUM"]), deleteProduct);

export default productsRouter;