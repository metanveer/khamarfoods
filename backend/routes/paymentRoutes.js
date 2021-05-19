import express from "express";
import {
  getIPN,
  getPaymentCancelMsg,
  getPaymentFailMsg,
  getPaymentSuccessMsg,
} from "../contollers/paymentController.js";
const router = express.Router();

router.route("/success").post(getPaymentSuccessMsg);
router.route("/fail").post(getPaymentFailMsg);
router.route("/cancel").post(getPaymentCancelMsg);
router.route("/ipn_listener").post(getIPN);

export default router;
