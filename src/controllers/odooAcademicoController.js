import { create_academico_odoo } from "../services/odooAcademicoService.js";
import { odoo_authenticate } from "../services/odooCobrancaService.js";

export async function controller_create_academico(req, res) {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ status: "error", message: `Missing request ${body}` });
    }

    const uid = await odoo_authenticate();
    const created_id = await create_academico_odoo(uid, body);
    console.log(body);
    res.json({ status: "success", created_id });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}
