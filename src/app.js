import express from "express";
import config from "./config/index.js";
import invoiceRoutes from "./routes/cobrancaRoutes.js";

const app = express();

app.use(express.json());
app.use("/", invoiceRoutes);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
