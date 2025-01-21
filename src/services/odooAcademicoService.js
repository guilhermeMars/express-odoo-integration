import { create_client } from "../utils/xmlrpcClient.js";
import config from "../config/index.js";
import axios from "axios";

async function fetchImage(url) {
  try {
    // Faz a requisição da imagem
    const response = await axios({
      url,
      method: "GET",
      responseType: "arraybuffer", // Recebe a resposta como buffer
    });

    // Base64 convert
    const base64Image = Buffer.from(response.data).toString("base64");

    return base64Image;
  } catch (error) {
    console.error("Download image error:", error.message);
    throw error; // Repassa o erro para o chamador
  }
}

function formatDate(dateString) {
  return new Date(dateString).toISOString().slice(0, 19).replace("T", " ");
}

export async function create_academico_odoo(uid, data) {
  const image = await fetchImage(
    data.Payload.Content.Contact.ProfilePictureUrl
  );

  if (
    data.Type === "ChatSectorChanged" &&
    data.Payload.Content.Sector.Name === "Acadêmico (Ranna)"
  ) {
    return new Promise((resolve, reject) => {
      const contentPath = data.Payload.Content;
      const object_client = create_client("/xmlrpc/2/object", config.odoo.url);
      object_client.methodCall(
        "execute_kw",
        [
          config.odoo.db,
          uid,
          config.odoo.password,
          "x_academico",
          "create",
          [
            {
              x_name: contentPath.Contact.Name,
              x_studio_partner_phone: contentPath.Contact.PhoneNumber,
              x_studio_data_hora: formatDate(data.EventDate),
              x_avatar_image: image,
              x_studio_stage_id: 7,
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
}
