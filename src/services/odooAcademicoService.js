import { create_client } from "../utils/xmlrpcClient.js";
import config from "../config/index.js";

export async function create_academico_odoo(uid, data) {
  return true;
  // if (data.Type === "MemberTranfer") {
  //   return new Promise((resolve, reject) => {
  //     const object_client = create_client("/xmlrpc/2/object", config.odoo.url);
  //     object_client.methodCall(
  //       "execute_kw",
  //       [
  //         config.odoo.db,
  //         uid,
  //         config.odoo.password,
  //         "x_academico",
  //         "create",
  //         [
  //           {
  //             x_name: data.contact.name,
  //             x_studio_partner_phone: data.contact.number,
  //             x_studio_usurio_umbler: data.user,
  //             x_studio_stage_id: 6,
  //           },
  //         ],
  //       ],
  //       (err, createdId) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(createdId);
  //         }
  //       }
  //     );
  //   });
  // }
}
