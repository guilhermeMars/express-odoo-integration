import express from "express";
import * as umblerController from "../controllers/odooAcademicoController.js";

const router = express.Router();

router.post("/create-academico", umblerController.controller_create_academico);

export default router;
