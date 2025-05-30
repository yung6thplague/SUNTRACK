const express = require("express");
const router = express.Router();
const axios = require("axios");
const Leitura = require("../models/Leitura");

router.get("/production/:userId", async (req, res) => {
  const { idClient } = req.params;

  try {
    const response = await axios.get("http://localhost:4000/production");
    const { producao, timestamp } = response.data;

    const leitura = new Leitura({ clientId: idClient, producao, timestamp });
    await leitura.save();

    res.json(leitura);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar produção" });
  }
});

module.exports = router;
