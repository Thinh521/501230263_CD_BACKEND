import express from "express";
import {
  listProduct,
  createProduct,
  renderPageCreateProduct,
  updateProduct,
  renderPageUpdateProduct,
  deleteProduct,
  renderPageDeleteProduct,
} from "../controllers/productController.js";
const router = express.Router();

router.get("/", listProduct);

router.get("/create", renderPageCreateProduct);
router.post("/create", createProduct);

router.get("/update/:id", renderPageUpdateProduct);
router.post("/update/:id", updateProduct);

router.get("/delete/:id", renderPageDeleteProduct);
router.post("/delete", deleteProduct);

export default router;
