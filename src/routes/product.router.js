import { Router } from "express";
import productController from "../controllers/products.controller.js";
import { authorization, passportCall } from "../middleware/passAuth.js";
// import uploader from "../services/upload.service.js";

const router = Router();

router.get("/", passportCall('jwt'), authorization(['admin']), productController.getProducts.bind(productController));

router.get("/:pid", productController.getProductById.bind(productController));

// VEEEEER
// router.post('/', uploader.single('image'), passportCall('jwt'), authorization(['admin']), productController.addProduct.bind(productController));
router.post('/', passportCall('jwt'), authorization(['admin']), productController.createProduct.bind(productController));

router.put('/:pid',passportCall('jwt'), authorization(['admin']), productController.updateProduct.bind(productController));

router.delete('/:pid',passportCall('jwt'), authorization(['admin']), productController.deleteProduct.bind(productController));

export default router;
