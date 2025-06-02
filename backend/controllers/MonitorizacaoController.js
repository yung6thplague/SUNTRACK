const axios = require('axios');
const Leitura = require('../models/Leitura');
const Credito = require('../models/Credito');

const API_MOCK_URL = 'http://localhost:4000/api/leituras';

exports.obterLeituraCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;

    const response = await axios.get(`${API_MOCK_URL}/${clienteId}`);
    const leituraData = response.data;

    const leitura = new Leitura({
      clienteId,
      dataHora: leituraData.dataHora,
      producaoKwH: leituraData.producaoKwH,
      voltagem: leituraData.voltagem,
      corrente: leituraData.corrente
    });

    await leitura.save();

    res.json(leitura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter leitura' });
  }
};

exports.calcularCreditos = async (req, res) => {
  try {
    const { clienteId } = req.params;

    const leituras = await Leitura.find({ clienteId });
    const totalKwH = leituras.reduce((sum, l) => sum + l.producaoKwH, 0);

    let credito = await Credito.findOne({ clienteId });
    if (!credito) {
      credito = new Credito({ clienteId, totalCreditos: totalKwH });
    } else {
      credito.totalCreditos = totalKwH;
      credito.ultimaAtualizacao = new Date();
    }

    await credito.save();

    res.json({ clienteId, totalCreditos: credito.totalCreditos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao calcular créditos' });
  }
};
