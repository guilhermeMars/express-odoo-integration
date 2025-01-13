import config from "../config/index.js";

export async function search_invoice_name(data) {
  try {
    const user_url = `${config.asaas.url}/${data.payment.customer}`;
    console.log(user_url);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        access_token: config.asaas.token,
      },
    };

    const response = await fetch(user_url, options);
    if (!response.ok) {
      // Lidar com status de erro HTTP
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const user = await response.json();

    console.log(user);
    return user.name;
  } catch (err) {
    console.error("Error fetching data:", err.message);
    throw err;
  }
}
