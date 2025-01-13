export async function search_invoice_name(data) {
  try {
    const user_url = config.asaas.url + `/${data.payment.customer}`;
    const options = { method: "GET", headers: { accept: "application/json" } };

    const response = await fetch(user_url, options);
    const user = await response.json();

    console.log(user);
    return user.data.name;
  } catch (err) {
    console.error("Error fetching data:", err.message);
    throw err;
  }
}
