import { Router } from "express";
import productController from "../controllers/products.controller.js";
import { authorization, passportCall } from "../middleware/passAuth.js";
import uploader from "../services/upload.service.js";

const router = Router();

router.get("/", productController.getProducts.bind(productController));

router.get("/:pid", productController.getProductById.bind(productController));

router.post('/', passportCall('jwt'), authorization(['admin', 'premium']), uploader.single('thumbnail'), productController.createProduct.bind(productController));

router.put('/:pid', passportCall('jwt'), authorization(['admin']), productController.updateProduct.bind(productController));

router.delete('/:pid', passportCall('jwt'), authorization(['admin', 'premium']), productController.deleteProduct.bind(productController));

export default router;
