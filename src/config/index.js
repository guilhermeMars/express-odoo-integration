import dotenv from "dotenv";

dotenv.config();

export default {
  port: 5000,
  asaas: {
    url: "https://api.asaas.com/v3/customers",
    token: process.env.ASAAS_KEY,
  },
  odoo: {
    url: "https://ebramev-corporativo.odoo.com",
    db: "ebramev-corporativo",
    username: "marketing3@ebramev.com.br",
    password: "4f2f61da00b82bf50bc98ecb89ce8df2cd9a67a8",
  },
};
