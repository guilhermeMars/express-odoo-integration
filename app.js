const express = require("express");
const xmlrpc = require("xmlrpc");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(express.json());

const ODOO_URL = "https://ebramev-corporativo.odoo.com";
const ODOO_DB = "ebramev-corporativo";
const ODOO_USERNAME = "marketing3@ebramev.com.br";
const ODOO_PASSWORD = process.env.ODOO_KEY;

// Helper function to create XML-RPC client
function create_client(path) {
  return xmlrpc.createClient({
    url: `${ODOO_URL}${path}`,
  });
}

// Authenticate with Odoo
async function odoo_authenticate() {
  return new Promise((resolve, reject) => {
    const common_client = create_client("/xmlrpc/2/common");
    common_client.methodCall(
      "authenticate",
      [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}],
      (err, uid) => {
        if (err || !uid) {
          reject(err || new Error("Authentication failed"));
        } else {
          resolve(uid);
        }
      }
    );
  });
}

async function create_invoice_odoo(uid, data) {
  return new Promise((resolve, reject) => {
    const object_client = create_client("/xmlrpc/2/object");
    object_client.methodCall(
      "execute_kw",
      [
        ODOO_DB,
        uid,
        ODOO_PASSWORD,
        // Alterar
        "x_receitas",
        "create",
        [
          {
            x_studio_date: data.dateCreated,
            x_name: data.payment.id,
            x_studio_descrio: data.payment.description,
            x_studio_id_1: data.payment.customer,
            ...(data.payment.dueDate
              ? { x_studio_vencimento: data.payment.dueDate }
              : {}),
            ...(data.payment.paymentDate
              ? { x_studio_data_de_pagamento: data.payment.paymentDate }
              : {}),
            ...(data.payment.creditDate
              ? { x_studio_data_de_crdito: data.payment.creditDate }
              : {}),
            x_studio_status: data.payment.status,
            x_studio_value: data.payment.value,
            x_studio_valor_lquido: data.payment.netValue,
            ...(data.billingType && data.billingType !== "UNDEFINED"
              ? { x_studio_forma_de_pagamento: data.billingType }
              : {}),
            x_studio_nmero_da_fatura: parseInt(data.payment.invoiceNumber) || 0,
          },
        ],
      ],
      (err, createdId) => {
        if (err) {
          reject(err);
        } else {
          resolve(createdId);
        }
      }
    );
  });
}

app.post("/create-invoice-odoo", async (req, res) => {
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
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
