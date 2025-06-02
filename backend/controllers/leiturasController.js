
const axios = require("axios");
const LeituraMensal = require("../models/LeituraMensal");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rodrigo.vieira131415@gmail.com",
    pass: "xlgv vapy hcox fbdd"
  }
});

exports.realizarLeituraMensal = async (req, res) => {
  const { clienteId } = req.params;

  try {
    const leituraAtual = await axios.get(`http://localhost:4000/api/leituras/${clienteId}`);
    const producaoAtual = leituraAtual.data.producaoKwH;

    const ultimaLeitura = await LeituraMensal.findOne({ clienteId }).sort({ dataLeitura: -1 });
    const producaoAnterior = ultimaLeitura ? ultimaLeitura.producaoKwH : 0;
    const producaoNova = producaoAtual - producaoAnterior;

    const consumoSimulado = 2.0;
    const creditoGerado = producaoNova - consumoSimulado;

    const novaLeitura = new LeituraMensal({
      clienteId,
      producaoKwH: producaoAtual,
      consumoKwH: consumoSimulado,
      creditoGerado
    });
    await novaLeitura.save();

    res.status(200).json({ message: "Leitura mensal efetuada com sucesso.", novaLeitura });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao realizar leitura mensal." });
  }
};

exports.enviarResumoPorEmail = async (req, res) => {
  const { clienteId } = req.params;

  try {
    const leituraAtual = await axios.get(`http://localhost:4000/api/leituras/${clienteId}`);
    const producaoAtual = leituraAtual.data.producaoKwH;

    const ultimaLeitura = await LeituraMensal.findOne({ clienteId }).sort({ dataLeitura: -1 });
    const producaoAnterior = ultimaLeitura ? ultimaLeitura.producaoKwH : 0;
    const producaoNova = producaoAtual - producaoAnterior;

    const consumoSimulado = 2.0;
    const creditoGerado = producaoNova - consumoSimulado;

    const novaLeitura = new LeituraMensal({
      clienteId,
      producaoKwH: producaoAtual,
      consumoKwH: consumoSimulado,
      creditoGerado
    });
    await novaLeitura.save();

    const cliente = await User.findById(clienteId);
    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });

    const nome = cliente?.nome || "user";

    await transporter.sendMail({
      from: '"Gestor Solar" <rodrigo.vieira131415@gmail.com>',
      to: cliente.email,
      subject: "Resumo Mensal de Energia",
      html: `
        <p>Olá <strong>${nome}</strong>,</p>
        <p>Este mês produziu <b>${producaoNova.toFixed(2)} kWh</b>.</p>
        <p>Após consumir <b>${consumoSimulado.toFixed(2)} kWh</b>, os seus <b>créditos</b> acumulados são: <b>${creditoGerado.toFixed(2)} kWh</b>.</p>
        <p>Obrigado por contribuir com energia renovável!</p>
      `
    });

    res.status(200).json({ message: "Email enviado com sucesso." });

  } catch (err) {
    console.error("Erro ao enviar email:", err);
    res.status(500).json({ message: "Erro ao enviar email." });
  }
};
exports.obterHistoricoMensal = async (req, res) => {
  const { clienteId } = req.params;

  try {
    const leituras = await LeituraMensal.find({ clienteId }).sort({ dataLeitura: 1 });

    const historico = leituras.map(leitura => ({
      mes: leitura.dataLeitura.toLocaleDateString("pt-PT", { month: 'short', year: 'numeric' }),
      producao: leitura.producaoKwH,
      consumo: leitura.consumoKwH,
      credito: leitura.creditoGerado
    }));

    res.json(historico);
  } catch (err) {
    console.error("Erro ao obter histórico:", err);
    res.status(500).json({ message: "Erro ao obter histórico do cliente." });
  }
};

