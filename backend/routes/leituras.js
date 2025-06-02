const express = require("express");
const router = express.Router();
const leiturasController = require("../controllers/leiturasController");

router.get("/historico/:clienteId", leiturasController.obterHistoricoMensal);

router.get("/mensal/:clienteId", leiturasController.realizarLeituraMensal);
router.post('/enviar-email/:clienteId', leiturasController.enviarResumoPorEmail);




module.exports = router;
