import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { authorization, passportCall } from "../middleware/passAuth.js";

const router = Router();

router.post("/", cartController.createCart.bind(cartController));

router.get("/:cid", cartController.getCart.bind(cartController));

router.post("/:cid/products/:pid", passportCall('jwt'), authorization(['user']), cartController.addProductToCart.bind(cartController));

router.put("/:cid/products/:pid", cartController.updateQuantityProductFromCart.bind(cartController));

router.put("/:cid", cartController.updateCart.bind(cartController));

router.delete("/:cid/products/:pid", cartController.deleteProductFromCart.bind(cartController));

router.delete("/:cid", cartController.deleteProductsFromCart.bind(cartController));

router.post("/:cid/purchase", (req, res, next) => {
    console.log('Ruta de compra accedida');
    next();
  }, passportCall("jwt"), cartController.createPurchaseTicket.bind(cartController));


export default router;