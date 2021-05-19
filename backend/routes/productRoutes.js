import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProduct,
} from "../contollers/productController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts).post(protect, admin, addProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
