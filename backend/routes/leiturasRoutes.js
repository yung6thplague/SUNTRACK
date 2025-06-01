const express = require("express");
const router = express.Router();
const controller = require("../controllers/leiturasController");
const auth = require("../middleware/authMiddleware");

router.get("/production/:clienteId", auth("gestor"), controller.registarLeitura);

module.exports = router;

