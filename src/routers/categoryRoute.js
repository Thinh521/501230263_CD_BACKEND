import express from "express";
import { listCaterory } from "../controllers/categoryController.js";
const router = express.Router();

router.get("/", listCaterory);

router.get("/create", (req, res) => {
  res.send("Create category");
});

export default router;
