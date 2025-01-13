import express from "express";
import * as invoiceController from "../controllers/odooController.js";

const router = express.Router();

router.post(
  "/create-invoice-odoo",
  invoiceController.controller_create_invoice
);
router.post(
  "/update-invoice-odoo",
  invoiceController.controller_update_invoice
);
router.post(
  "/delete-invoice-odoo",
  invoiceController.controller_delete_invoice
);

export default router;
