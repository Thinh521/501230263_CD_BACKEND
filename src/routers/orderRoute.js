import express from "express";
import {
  detail,
  listOrder,
  createOrder,
  renderPageSimulateCreateOrder,
  simulatorCreateOrder,
  renderCancelOrderForm,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", listOrder);

router.post("/create", createOrder);
router.get("/create", renderPageSimulateCreateOrder);
router.post("/simulatorCreate", simulatorCreateOrder);
router.get("/cancel-form/:id", renderCancelOrderForm);
router.get("/detail/:id", detail);

export default router;
