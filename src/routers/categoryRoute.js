import express from "express";
import {
  listCaterory,
  createCaterory,
  renderPageCreateCategory,
} from "../controllers/categoryController.js";
const router = express.Router();

router.get("/", listCaterory);
router.get("/create", renderPageCreateCategory);
router.post("/create", createCaterory);

export default router;
