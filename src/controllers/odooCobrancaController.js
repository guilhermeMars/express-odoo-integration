import {
  create_cobranca_odoo,
  delete_cobranca_odoo,
  update_cobranca_odoo,
  odoo_authenticate,
} from "../services/odooCobrancaService.js";

export async function controller_create_cobranca(req, res) {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ status: "error", message: `Missing request ${body}` });
    }

    const uid = await odoo_authenticate();
    const created_id = await create_cobranca_odoo(uid, body);

    res.json({ status: "success", created_id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function controller_update_cobranca(req, res) {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ status: "error", message: `Missing request ${body}` });
    }

    const uid = await odoo_authenticate();
    const updated_id = await update_cobranca_odoo(uid, body);

    res.json({ status: "success", updated_id });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function controller_delete_cobranca(req, res) {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ status: "error", message: `Missing request ${body}` });
    }

    const uid = await odoo_authenticate();
    const deleted_id = await delete_cobranca_odoo(uid, body);

    res.json({ status: "success", deleted_id });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}
