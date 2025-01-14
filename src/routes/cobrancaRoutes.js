import express from "express";
import * as invoiceController from "../controllers/odooCobrancaController.js";

const router = express.Router();

router.post(
  "/create-invoice-odoo",
  invoiceController.controller_create_cobranca
);
router.post(
  "/update-invoice-odoo",
  invoiceController.controller_update_cobranca
);
router.post(
  "/delete-invoice-odoo",
  invoiceController.controller_delete_cobranca
);

export default router;
