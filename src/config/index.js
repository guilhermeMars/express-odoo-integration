import dotenv from "dotenv";

dotenv.config();

export default {
  port: 5000,
  asaas: {
    url: "https://api.asaas.com/v3/customers",
    token:
      "$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmQ5OTUyNzVkLTI3ZDEtNDc2Ny05ZjRiLTFhZTlkYzk4NjdkZjo6JGFhY2hfZTgyMjFkNTAtYTY4ZC00Yzg3LTgwNjQtZjE5MmQwMzViYTQ3",
  },
  odoo: {
    url: "https://ebramev-corporativo.odoo.com",
    db: "ebramev-corporativo",
    username: "marketing3@ebramev.com.br",
    password: process.env.ODOO_KEY,
  },
};
