// backend/controllers/installationController.js

const Installation = require("../models/Installation");

// POST /api/installations
const createInstallation = async (req, res) => {
  try {
    const { installDate, address, panelCount, capacityKw } = req.body;

    if (!installDate || !address || !panelCount || !capacityKw) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const newInstallation = new Installation({
      installDate,
      address,
      panelCount,
      capacityKw,
      user: req.user.id
    });

    await newInstallation.save();
    res.status(201).json({ message: "Instalação registada com sucesso!", installation: newInstallation });
  } catch (error) {
    console.error("Erro ao registar instalação:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

// GET /api/installations (somente para debugging ou listagem geral)
const getUserInstallations = async (req, res) => {
  try {
    const installations = await Installation.find({ user: req.user.id }).sort({ installDate: -1 });
    res.json(installations);
  } catch (error) {
    console.error("Erro ao obter instalações:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

module.exports = {
  createInstallation,
  getUserInstallations
};