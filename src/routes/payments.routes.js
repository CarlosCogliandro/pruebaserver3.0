import { Router } from "express";
import { handlePaymentSuccess, crearPago } from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-checkout-session", crearPago);

router.get("/payment-success", handlePaymentSuccess);

router.get("/cancel", (req, res) => {});

export default router;