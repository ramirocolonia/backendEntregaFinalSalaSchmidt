import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { passportCall } from "../utils.js";

const cartsRouter = Router();
const {
  newCart,
  loadCart,
  addProductInCart,
  removeProductFromCart,
  updateCartItems,
  updateQuantityItemCart,
  removeAllProductsFromCart,
  createTicket
} = new CartController();

cartsRouter.post("/", newCart);
cartsRouter.get("/:cid", loadCart);
cartsRouter.post("/:cid/products/:pid", passportCall("jwt", ["USER", "PREMIUM"]), addProductInCart);
cartsRouter.delete("/:cid/products/:pid", removeProductFromCart);
cartsRouter.put("/:cid", updateCartItems);
cartsRouter.put("/:cid/products/:pid", updateQuantityItemCart);
cartsRouter.delete("/:cid", removeAllProductsFromCart);
cartsRouter.post("/:cid/purchase", passportCall("jwt", ["USER", "PREMIUM"]), createTicket);

export default cartsRouter;
