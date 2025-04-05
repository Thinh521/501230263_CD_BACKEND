import express from "express";
import {
  listCaterory,
  createCaterory,
  renderPageCreateCategory,
  updateCaterory,
  renderPageUpdateCategory,
  deleteCaterory,
  renderPageDeleteCategory,
  createCategoryByModal,
} from "../controllers/categoryController.js";
const router = express.Router();

router.get("/", listCaterory);

router.get("/create", renderPageCreateCategory);
router.post("/create", createCaterory);
router.post("/createByModal", createCategoryByModal);

router.get("/update/:id", renderPageUpdateCategory);
router.post("/update/:id", updateCaterory);

router.get("/delete/:id", renderPageDeleteCategory);
router.post("/delete", deleteCaterory);

export default router;
