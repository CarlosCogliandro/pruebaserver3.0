import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { authorization, passportCall } from "../middleware/passAuth.js";
import userModel from "../dao/mongoDB/models/user.model.js";

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

router.get("/usuario/carrito", passportCall('jwt'), authorization(['user']), async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user || !user.cart) { return res.status(404).json({ error: "Carrito no encontrado" }); }
    return res.json({ id: user.cart });
  } catch (error) {
    req.logger.error("Error obteniendo el carrito del usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;