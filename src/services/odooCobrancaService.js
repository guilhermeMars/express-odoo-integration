import { create_client } from "../utils/xmlrpcClient.js";
import { search_invoice_name } from "./asaasService.js";
import config from "../config/index.js";

export async function odoo_authenticate() {
  return new Promise((resolve, reject) => {
    const common_client = create_client("/xmlrpc/2/common", config.odoo.url);
    common_client.methodCall(
      "authenticate",
      [config.odoo.db, config.odoo.username, config.odoo.password, {}],
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

export function get_tag_id(data) {
  const dueDate = new Date(data.payment.dueDate);
  const today = new Date();
  const differenceInMilliseconds = dueDate - today;
  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  if (differenceInDays === 0) {
    return [6];
  }
  if (differenceInDays < 0) {
    return [7];
  }
  if (differenceInDays <= 1) {
    return [5];
  }
  if (differenceInDays <= 3) {
    return [4];
  }
  if (differenceInDays <= 7) {
    return [3];
  }
  if (differenceInDays <= 15) {
    return [2];
  }
  if (differenceInDays >= 16) {
    return [1];
  }
  return [0];
}
export async function create_cobranca_odoo(uid, data) {
  return new Promise((resolve, reject) => {
    search_invoice_name(data).then((user_name) => {
      const object_client = create_client("/xmlrpc/2/object", config.odoo.url);
      object_client.methodCall(
        "execute_kw",
        [
          config.odoo.db,
          uid,
          config.odoo.password,
          "x_receitas",
          "create",
          [
            {
              x_studio_date: data.dateCreated,
              x_name: user_name.toString(),
              x_studio_id: data.payment.id,
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
              ...(data.payment.dueDate
                ? { x_studio_tag_ids: get_tag_id(data) }
                : {}),
              x_studio_value: data.payment.value,
              x_studio_valor_lquido: data.payment.netValue,
              ...(data.payment.billingType &&
              data.payment.billingType !== "UNDEFINED"
                ? { x_studio_forma_de_pagamento: data.payment.billingType }
                : {}),
              x_studio_nmero_da_fatura:
                parseInt(data.payment.invoiceNumber) || 0,
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
  });
}

export async function update_cobranca_odoo(uid, data) {
  return new Promise((resolve, reject) => {
    search_invoice_name(data).then((user_name) => {
      const object_client = create_client("/xmlrpc/2/object", config.odoo.url);
      object_client.methodCall(
        "execute_kw",
        [
          config.odoo.db,
          uid,
          config.odoo.password,
          // Alterar
          "x_receitas",
          "search_read",
          [[["x_studio_id", "=", data.payment.id]]],
          { limit: 1 },
        ],
        (err, recordIds) => {
          if (err) {
            return reject(err);
          }
          if (!recordIds || recordIds.length === 0) {
            let createdCobrancaId = 0;
            create_cobranca_odoo(uid, data).then((createdId) => {
              createdCobrancaId = createdId;
              resolve(createdCobrancaId);
            });
            return createdCobrancaId;
          }

          const recordId = recordIds[0];

          object_client.methodCall(
            "execute_kw",
            [
              config.odoo.db,
              uid,
              config.odoo.password,
              "x_receitas",
              "write",
              [
                [recordId.id],
                {
                  x_studio_date: data.dateCreated,
                  x_name: user_name,
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
                  ...(data.payment.dueDate
                    ? { x_studio_tag_ids: get_tag_id(data) }
                    : {}),
                  x_studio_value: data.payment.value,
                  x_studio_valor_lquido: data.payment.netValue,
                  ...(data.payment.billingType &&
                  data.payment.billingType !== "UNDEFINED"
                    ? { x_studio_forma_de_pagamento: data.payment.billingType }
                    : {}),
                  x_studio_nmero_da_fatura:
                    parseInt(data.payment.invoiceNumber) || 0,
                },
              ],
            ],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        }
      );
    });
  });
}

export async function delete_cobranca_odoo(uid, data) {
  return new Promise((resolve, reject) => {
    const object_client = create_client("/xmlrpc/2/object", config.odoo.url);

    object_client.methodCall(
      "execute_kw",
      [
        config.odoo.db,
        uid,
        config.odoo.password,
        // Alterar
        "x_receitas",
        "search_read",
        [[["x_studio_id", "=", data.payment.id]]],
        { limit: 1 },
      ],
      (err, recordIds) => {
        if (err) {
          return reject(err);
        }
        if (!recordIds || recordIds.length === 0) {
          // Not all data is present in the odoo database
          // return reject(new Error("No matching records found for deletion"));
          return null;
        }

        const recordId = recordIds[0];

        // Em seguida, excluir os registros encontrados
        object_client.methodCall(
          "execute_kw",
          [
            config.odoo.db,
            uid,
            config.odoo.password,
            "x_receitas",
            "unlink",
            [[recordId.id]],
          ],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      }
    );
  });
}
