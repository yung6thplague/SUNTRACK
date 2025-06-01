const axios = require("axios");
const LeituraMensal = require("../models/LeituraMensal");

exports.registarLeitura = async (req, res) => {
  const { clienteId } = req.params;

  try {
    
    const resposta = await axios.get("http://localhost:4000/production");
    const producao = parseFloat(resposta.data.producao);
    const timestamp = resposta.data.timestamp;

    
    const consumo = parseFloat((Math.random() * 50).toFixed(2));
    const credito = producao - consumo;

    
    const novaLeitura = new LeituraMensal({
      clienteId,
      producaoKwH: producao,
      consumoKwH: consumo,
      creditoGerado: credito,
      dataLeitura: new Date(timestamp)
    });

    await novaLeitura.save();

    res.status(201).json({
      message: "Leitura registrada com sucesso",
      leitura: novaLeitura
    });

  } catch (err) {
    res.status(500).json({ error: "Erro ao registar leitura: " + err.message });
  }
};
