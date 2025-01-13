import {
  create_invoice_odoo,
  delete_invoice_odoo,
  update_invoice_odoo,
  odoo_authenticate,
} from "../services/odooService.js";

export async function controller_create_invoice(req, res) {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ status: "error", message: `Missing request ${body}` });
    }

    const uid = await odoo_authenticate();
    const created_id = await create_invoice_odoo(uid, body);

    res.json({ status: "success", created_id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function controller_update_invoice(req, res) {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ status: "error", message: `Missing request ${body}` });
    }

    const uid = await odoo_authenticate();
    const updated_id = await update_invoice_odoo(uid, body);

    res.json({ status: "success", updated_id });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function controller_delete_invoice(req, res) {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ status: "error", message: `Missing request ${body}` });
    }

    const uid = await odoo_authenticate();
    const deleted_id = await delete_invoice_odoo(uid, body);

    res.json({ status: "success", deleted_id });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}
