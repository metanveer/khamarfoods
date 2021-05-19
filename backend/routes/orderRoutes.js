import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  getPaidOrderById,
  getMyOrders,
} from "../contollers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addOrderItems);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").get(protect, getPaidOrderById);

export default router;
